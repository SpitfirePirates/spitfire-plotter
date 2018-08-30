const Motor = require('./Motor.js')
const Stepper = require('wpi-stepper').Stepper

class LeftMotor extends Motor {

    constructor(length) {
        super(length)
        this.pins= [
            17,
            18,
            27,
            22,
        ]
        this.stepper = new Stepper({ pins: this.pins, steps: 4076, mode: this.mode })
        this.stepper.speed = 10
    }

    reelIn(steps) {
        return this.stepper.move(steps)
    }

    reelOut(steps) {
        return this.stepper.move(steps * -1)
    }
}

module.exports = LeftMotor
