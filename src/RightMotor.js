const Motor = require('./Motor.js')

class RightMotor extends Motor {

    constructor() {
        super(11, 9, 17, 27, 22)
    }

    reelIn(steps, speed) {
        return this.step(steps, 'reverse', speed)
    }

    reelOut(steps, speed) {
        return this.step(steps, 'forward', speed);
    }
}

module.exports = RightMotor
