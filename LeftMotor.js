const Motor = require('./Motor.js')

class LeftMotor extends Motor {

    constructor(length) {
        super(length)
        this.stepper = this.steppers[0];
    }

    reelIn(steps) {
        return new Promise((resolve,reject) => {
            this.stepper.step('fwd',steps, resolve)
        })
    }

    reelOut(steps) {
        return new Promise((resolve,reject) => {
            this.stepper.step('back',steps, resolve)
        })
    }
}

module.exports = LeftMotor
