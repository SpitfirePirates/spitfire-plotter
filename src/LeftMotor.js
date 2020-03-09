const Motor = require('./Motor.js')

class LeftMotor extends Motor {

    constructor(length) {
        super(26, 19, 5, 6, 13, length);
    }

    reelIn(steps, speed) {
        return this.step(steps, 'forward', speed, -1)
    }

    reelOut(steps, speed) {
        return this.step(steps, 'reverse', speed, 1)
    }
}

module.exports = LeftMotor
