const Motor = require('./Motor.js')

class RightMotor extends Motor {

    constructor(length) {
        super(length)
        this.stepper = this.steppers[1];
    }

    reelIn(steps) {
        return new Promise((resolve,reject) => {
            this.stepper.step('back',steps, resolve)
        })
    }

    reelOut(steps) {
        return new Promise((resolve,reject) => {
            this.stepper.step('fwd',steps, resolve)
        })
    }
}

module.exports = RightMotor
