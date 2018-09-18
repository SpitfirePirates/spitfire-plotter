const Motor = require('./Motor.js')

class LeftMotor extends Motor {

    constructor(length) {
        super(length, 21, 20)
    }

    reelIn(steps, speed) {
        return this.step(steps, 'forward', speed)
    }

    reelOut(steps, speed) {
        return this.step(steps, 'reverse', speed)
    }
}

module.exports = LeftMotor
