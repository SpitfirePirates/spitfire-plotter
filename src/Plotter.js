const LeftMotor  = require('./LeftMotor.js')
const RightMotor = require('./RightMotor.js')
const io = require('socket.io')(3000)
const debug = (process.env.NODE_ENV !== 'production')

class Plotter
{

    constructor() {
        this.position = { x: 0, y: 0 }
        this.pointsHistory = []
        io.on('connection', socket => {
            console.log('sending history', this.pointsHistory)
            socket.emit('history', this.pointsHistory)
        })

        // const motorDistance = 600; //mm
        // const gearDiameter = 49.81; //mm
        // const gearCircumference = Math.PI*gearDiameter; //mm
        // const motorDistanceRotations = motorDistance/gearCircumference;
        // const boardWidthSteps = (motorDistanceRotations/motorDistance) * 4076; //steps

        this.board = { width: 1430, height: 1300 }

        this.leftMotor = new LeftMotor(0)
        this.rightMotor = new RightMotor(this.board.width)
    }

    // move relative to the current position
    move(x, y) {
        const absx = this.position.x + x
        const absy = this.position.y + y

        const leftHypo = Math.hypot(absx, absy)
        const rightHypo = Math.hypot(this.board.width - absx, absy)

        let rightLengthDelta = Math.round(Math.abs(rightHypo - this.rightMotor.length));
        let leftLengthDelta = Math.round(Math.abs(leftHypo - this.leftMotor.length));

        let rightMove;
        let leftMove;

        let rightSpeed;
        let leftSpeed;

        if (rightLengthDelta > leftLengthDelta) {
            rightSpeed = 1;
            leftSpeed = leftLengthDelta/rightLengthDelta;
        } else {
            leftSpeed = 1;
            rightSpeed = rightLengthDelta/leftLengthDelta;
        }

        if(leftHypo > this.leftMotor.length) {
            console.log('left out', leftLengthDelta)
            leftMove = this.leftMotor.reelOut(leftLengthDelta, leftSpeed)
        } else {
            console.log('left in', leftLengthDelta)
            leftMove = this.leftMotor.reelIn(leftLengthDelta, leftSpeed)
        }

        if(rightHypo > this.rightMotor.length) {
            console.log('right out', rightLengthDelta)
            rightMove = this.rightMotor.reelOut(rightLengthDelta, rightSpeed)
        } else {
            console.log('right in', rightLengthDelta)
            rightMove = this.rightMotor.reelIn(rightLengthDelta, rightSpeed)
        }

        this.leftMotor.length = leftHypo
        this.rightMotor.length = rightHypo

        this.position.x = absx
        this.position.y = absy

        this.onMove(this.position, leftHypo, rightHypo)

        return Promise.all([leftMove,rightMove])
    }

    async moveInterpolate(x,y) {
        const interpolationPrecision = Math.min(Math.abs(x),Math.abs(y))/10;

        for(let i=0;i<=interpolationPrecision;i++) {
            await this.move(x/interpolationPrecision, y/interpolationPrecision);
        }
    }

    release() {
        this.leftMotor.release()
        this.rightMotor.release()
    }

    onMove(newPosition, leftHypo, rightHypo) {
        console.log('hleft', leftHypo)
        console.log('hright', rightHypo)
        console.log('new pos', newPosition)

        if (debug) {
            this.pointsHistory.push(Object.assign({}, newPosition))
            io.emit('move', newPosition)
        }
    }
}

module.exports = Plotter
