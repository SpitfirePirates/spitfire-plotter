const debug = (process.env.NODE_ENV !== 'production')
const gpio = debug ? require('@rafaelquines/pigpio-mock').Gpio : require('pigpio').Gpio

class Motor {

    constructor(pinDirection, pinStep, msPin0, msPin1, msPin2, length) {
        this.pins = {
            direction: new gpio(pinDirection, {mode: gpio.OUTPUT}),
            step: new gpio(pinStep, {mode: gpio.OUTPUT}),
        }

        this.length = length;

        this.stepEventHandlers = []

        if (typeof msPin0 !== 'undefined' && typeof msPin1 !== 'undefined' && typeof msPin2 !== 'undefined') {
            this.pins.microStepping = [
                new gpio(msPin0, {mode: gpio.OUTPUT}),
                new gpio(msPin1, {mode: gpio.OUTPUT}),
                new gpio(msPin2, {mode: gpio.OUTPUT}),
            ]
            this.setMicroSteppingMode();
        }

    }

    addStepEventHandler(callback) {
        this.stepEventHandlers.push(callback);
    }

    setMicroSteppingMode() {
        this.pins.microStepping[0].digitalWrite(0);
        this.pins.microStepping[1].digitalWrite(1);
        this.pins.microStepping[2].digitalWrite(0);
    }

    release() {
        return new Promise((resolve, reject) => {
            // exec(`release.py`, [this.pins.direction, this.pins.step], (error, stdout, stderr) => {
            //     error ? reject():resolve()
            // });
        });
    }

    step(count, direction, speed, incdec) {

        const minTimePerStep = 40;

        return new Promise(async (resolve, reject) => {
            this.pins.direction.digitalWrite(direction === 'forward' ? 0:1)
            for(let steps = 0;steps < count; steps++) {
                this.pins.step.trigger(100,1)

                this.length += incdec

                this.stepEventHandlers.forEach(handler => handler(this.length))

                await new Promise((resolve1, reject1) => {
                    let perStep = speed;
                    setTimeout(resolve1,perStep)
                })
            }
            resolve();
        });
    }
}

module.exports = Motor

