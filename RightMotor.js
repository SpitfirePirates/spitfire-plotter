const Motor = require('./Motor.js')

class RightMotor extends Motor {

    constructor(length) {
        super(length, 23, 24)
    }

    reelIn(steps) {
        return this.step(steps, 'reverse')
    }

    reelOut(steps) {
        return this.step(steps, 'forward');
    }
}

module.exports = RightMotor
