const Motor = require('./Motor.js')

class LeftMotor extends Motor {

    constructor() {
        super(26, 19, 5, 6, 13);
    }

    reelIn(steps, speed) {
        return this.step(steps, 'forward', speed)
    }

    reelOut(steps, speed) {
        return this.step(steps, 'reverse', speed)
    }
}

module.exports = LeftMotor
