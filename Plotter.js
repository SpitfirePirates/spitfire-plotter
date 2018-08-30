const LeftMotor  = require('./LeftMotor.js')
const RightMotor = require('./RightMotor.js')

class Plotter
{

    constructor() {
        this.position = { x: 0, y: 0 }

	const motorDistance = 600; //mm
	const gearDiameter = 49.81; //mm
	const gearCircumference = Math.PI*gearDiameter; //mm
	const motorDistanceRotations = motorDistance/gearCircumference;
	const boardWidthSteps = (motorDistanceRotations/motorDistance) * 4076; //steps

        this.board = { width: boardWidthSteps, height: boardWidthSteps }

        this.leftMotor = new LeftMotor(0)
        this.rightMotor = new RightMotor(this.board.width)
    }

    // move relative to the current position
    move(x, y) {
        const absx = this.position.x + x
	const absy = this.position.y + y
        const leftHypo = Math.hypot(absx, absy)
        const rightHypo = Math.hypot(this.board.width - absx, absy)

        this.leftMotor.setLength(leftHypo)
        this.rightMotor.setLength(rightHypo)
    }
}

module.exports = Plotter
