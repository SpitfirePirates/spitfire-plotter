const LeftMotor  = require('./LeftMotor.js')
const RightMotor = require('./RightMotor.js')

class Plotter
{

    constructor() {
        this.position = { x: 0, y: 0 }

        // const motorDistance = 600; //mm
        // const gearDiameter = 49.81; //mm
        // const gearCircumference = Math.PI*gearDiameter; //mm
        // const motorDistanceRotations = motorDistance/gearCircumference;
        // const boardWidthSteps = (motorDistanceRotations/motorDistance) * 4076; //steps

        this.board = { width: 13000, height: 40000 }

        this.leftMotor = new LeftMotor(0)
        this.rightMotor = new RightMotor(this.board.width)
    }

    // move relative to the current position
    move(x, y) {
        const absx = this.position.x + x
        const absy = this.position.y + y

        const leftHypo = Math.hypot(absx, absy)
        const rightHypo = Math.hypot(this.board.width - absx, absy)

        console.log('hleft', leftHypo)
        console.log('hright', rightHypo)

        let leftLengthDelta = Math.round(Math.abs(leftHypo - this.leftMotor.length));
        let leftMove;

        if(leftHypo > this.leftMotor.length) {
            console.log('left out', leftLengthDelta)
            leftMove = this.leftMotor.reelOut(leftLengthDelta)
        } else {
            console.log('left in', leftLengthDelta)
            leftMove = this.leftMotor.reelIn(leftLengthDelta)
        }


        let rightLengthDelta = Math.round(Math.abs(rightHypo - this.rightMotor.length));
        let rightMove;

        if(rightHypo > this.rightMotor.length) {
            console.log('right out', rightLengthDelta)
            rightMove = this.rightMotor.reelOut(rightLengthDelta)
        } else {
            console.log('right in', rightLengthDelta)
            rightMove = this.rightMotor.reelIn(rightLengthDelta)
        }

        this.leftMotor.length = leftHypo
        this.rightMotor.length = rightHypo

        this.position.x = absx
        this.position.y = absy

        return Promise.all([leftMove,rightMove])
    }
}

module.exports = Plotter
