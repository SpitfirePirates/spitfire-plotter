const Motor = require('./Motor.js')

class LeftMotor extends Motor {

    constructor(length) {
        super(length)
        this.pins = {
            'direction': 0,
            'step': 0,
        }
    }

    reelIn(steps) {
        return this.step('forward', steps)
    }

    reelOut(steps) {
        return this.step('reverse', steps);
    }
}

module.exports = LeftMotor
