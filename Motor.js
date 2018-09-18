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

    step(count, direction, speed) {

        const minTimePerStep = 20;

        return new Promise(async (resolve, reject) => {
            this.pins.direction.digitalWrite(direction === 'forward' ? 0:1)
            for(let steps = 0;steps < count; steps++) {
                this.pins.step.trigger(100,1)

                await new Promise((resolve1, reject1) => {
                    let perStep = minTimePerStep/speed;
                    setTimeout(resolve1,perStep)
                })
            }
            resolve();
        });
    }
}

module.exports = Motor

