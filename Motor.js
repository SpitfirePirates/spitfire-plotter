const gpio = require('pigpio').Gpio

class Motor {

    constructor(length, pinDirection, pinStep) {
        this.length = length
        this.pins = {
            direction: new gpio(pinDirection, {mode: gpio.OUTPUT}),
            step: new gpio(pinStep, {mode: gpio.OUTPUT}),
        }

    }

    release() {
        return new Promise((resolve, reject) => {
            // exec(`release.py`, [this.pins.direction, this.pins.step], (error, stdout, stderr) => {
            //     error ? reject():resolve()
            // });
        });
    }

    step(count, direction) {
        return new Promise(async (resolve, reject) => {
            this.pins.direction.digitalWrite(direction === 'forward' ? 0:1)
            for(let steps = 0;steps < count; steps++) {
                this.pins.step.digitalWrite(1)
                this.pins.step.digitalWrite(0)

                await new Promise((resolve1, reject1) => {
                    setTimeout(resolve1,5)
                })
            }
            resolve();
        });
    }
}

module.exports = Motor

