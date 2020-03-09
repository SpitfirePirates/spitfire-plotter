const Motor = require('./Motor.js')

class RightMotor extends Motor {

    constructor(length) {
        super(11, 9, 17, 27, 22, length)
    }

    reelIn(steps, speed) {
        return this.step(steps, 'reverse', speed, -1)
    }

    reelOut(steps, speed) {
        return this.step(steps, 'forward', speed, 1);
    }
}

module.exports = RightMotor
