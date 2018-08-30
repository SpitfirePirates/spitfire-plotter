const Motor = require('./Motor.js')
const Stepper = require('wpi-stepper').Stepper

class RightMotor extends Motor {

    constructor(length) {
        super(length)
        this.pins= [
            23,
            24,
            25,
            4,
        ]
        this.stepper = new Stepper({ pins: this.pins, steps: 4076, mode: this.mode })
        this.stepper.speed = 10
    }

    reelIn(steps) {
        return this.stepper.move(steps * -1)
    }

    reelOut(steps) {
        return this.stepper.move(steps)
    }
}

module.exports = RightMotor
