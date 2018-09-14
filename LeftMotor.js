const Motor = require('./Motor.js')

class LeftMotor extends Motor {

    constructor(length) {
        super(length, 21, 20)
    }

    reelIn(steps) {
        return this.step(steps, 'forward')
    }

    reelOut(steps) {
        return this.step(steps, 'reverse')
    }
}

module.exports = LeftMotor
