const LeftMotor  = require('./LeftMotor.js')
const RightMotor = require('./RightMotor.js')

class Plotter
{

    constructor() {
        this.position = { x: 0, y: 0 }
        this.board = { width: 300, height: 300 }
        this.leftMotor = new LeftMotor(0)
        this.rightMotor = new RightMotor(this.board.width)
    }

    move(x, y) {
        const absx = this.position.x + x;
        const absy = this.position.y + y;
        const leftHypo = Math.sqrt(Math.pow(absx, 2) + Math.pow(absy, 2))
        const rightHypo = Math.sqrt(Math.pow(this.board.width - absx, 2) + Math.pow(absy, 2))

        this.leftMotor.setLength(leftHypo)
        this.rightMotor.setLength(rightHypo)
    }
}

module.exports = Plotter