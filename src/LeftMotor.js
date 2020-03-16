const Motor = require('./Motor.js')

class LeftMotor extends Motor {

    constructor(length) {
        super(26, 19, 5, 6, 13, length);
    }

    reelIn(steps, speed) {
        return new Promise(resolve => {
            for (let i = 0; i< steps; i++) {
                this.stepOnce('forward', -1)
            }
            resolve();
        })
    }

    reelOut(steps, speed) {
        return new Promise(resolve => {
            for (let i = 0; i< steps; i++) {
                this.stepOnce('reverse', 1)
            }
            resolve();
        })
    }
}

module.exports = LeftMotor
