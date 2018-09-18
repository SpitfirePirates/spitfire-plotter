const Motor = require('./Motor.js')

class RightMotor extends Motor {

    constructor(length) {
        super(length, 23, 24)
    }

    reelIn(steps, speed) {
        return this.step(steps, 'reverse', speed)
    }

    reelOut(steps, speed) {
        return this.step(steps, 'forward', speed);
    }
}

module.exports = RightMotor
