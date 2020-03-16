const Motor = require('./Motor.js')

class RightMotor extends Motor {

    constructor(length) {
        super(11, 9, 17, 27, 22, length)
    }

    reelIn(steps, speed) {
        return new Promise(resolve => {
            for (let i = 0; i< steps; i++) {
                this.stepOnce( 'reverse', -1)
            }
            resolve();
        })
    }

    reelOut(steps, speed) {
        return new Promise(resolve => {
            for (let i = 0; i< steps; i++) {
                this.stepOnce( 'forward', 1)
            }
            resolve();
        })
    }
}

module.exports = RightMotor
