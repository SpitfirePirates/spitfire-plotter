const LeftMotor  = require('./LeftMotor.js')
const RightMotor = require('./RightMotor.js')
const fs = require("fs");
const io = require('socket.io')(3000)
const debug = (process.env.NODE_ENV !== 'production')

class Plotter
{

    constructor() {
        process.on('exit', (code) => {
            this.setStoredState();
        });
        process.on('SIGINT', _ => {
            process.exit();
        });

        this.pointsHistory = []

        io.on('connection', socket => {
            socket.emit('history', this.pointsHistory)
        })

        this.microsteppingMultiplier = 4;

        // const motorDistance = 600; //mm
        // const gearDiameter = 49.81; //mm
        // const gearCircumference = Math.PI*gearDiameter; //mm
        // const motorDistanceRotations = motorDistance/gearCircumference;
        // const boardWidthSteps = (motorDistanceRotations/motorDistance) * 4076; //steps

        this.board = { width: 1430*this.microsteppingMultiplier, height: 1100*this.microsteppingMultiplier }

        this.leftMotor = new LeftMotor(0)
        this.rightMotor = new RightMotor(this.board.width)

        const restoredState = this.getStoredState();

        this.position = restoredState.position;
        this.leftMotor.length = restoredState.leftMotor.length;
        this.rightMotor.length = restoredState.rightMotor.length;

        this.pointsHistory.push(Object.assign({}, this.position))
    }

    // move relative to the current position
    move(x, y) {

        x = Math.round(x);
        y = Math.round(y);

        const absx = this.position.x + x
        const absy = this.position.y + y

        const leftHypo = Math.round(Math.hypot(absx, absy))
        const rightHypo = Math.round(Math.hypot(this.board.width - absx, absy))

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
            leftMove = this.leftMotor.reelOut(leftLengthDelta, leftSpeed)
        } else {
            leftMove = this.leftMotor.reelIn(leftLengthDelta, leftSpeed)
        }

        if(rightHypo > this.rightMotor.length) {
            rightMove = this.rightMotor.reelOut(rightLengthDelta, rightSpeed)
        } else {
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
        let interpolationPrecision = Math.min(Math.abs(x),Math.abs(y));
        interpolationPrecision = Math.max(interpolationPrecision,1);

        if (interpolationPrecision > 10) {
            interpolationPrecision /=10;
        }

        for(let i=0;i<interpolationPrecision;i++) {
            await this.move(x/interpolationPrecision, y/interpolationPrecision);
        }
    }

    async home() {
        await this.move(-this.position.x, -this.position.y);
    }

    release() {
        this.leftMotor.release()
        this.rightMotor.release()
    }

    onMove(newPosition, leftHypo, rightHypo) {
        console.log('new pos', newPosition)

        if (debug) {
            this.pointsHistory.push(Object.assign({}, newPosition))
            io.emit('move', newPosition)
        }
    }

    setStoredState() {
        const state = {
            'position': this.position,
            'leftMotor': {
                'length': this.leftMotor.length
            },
            'rightMotor': {
                'length': this.rightMotor.length
            }
        };

        fs.writeFileSync('state.json', JSON.stringify(state));
    }

    getStoredState() {

        try {
            fs.accessSync('state.json', fs.constants.R_OK | fs.constants.W_OK);

            return JSON.parse(fs.readFileSync('state.json'))
        } catch (err) {
            return {
                'position': {
                    'x': 0,
                    'y': 0
                },
                'leftMotor': {
                    'length': 0
                },
                'rightMotor': {
                    'length': this.board.width
                }
            };
        }

    }
}

module.exports = Plotter
