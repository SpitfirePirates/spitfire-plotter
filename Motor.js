const motorHat = require('motor-hat');

class Motor {

    constructor(length) {
        this.length = length
        this.stepperController = motorHat({address: 0x60, steppers: [{ W1: 'M1', W2: 'M2' },{ W1: 'M3', W2: 'M4' }]});
        this.stepperController.init();

        this.steppers = this.stepperController.steppers;

        this.steppers[0].setSpeed({'rpm': 60})
        this.steppers[0].setSteps(200)
        this.steppers[0].setStyle('single')

        this.steppers[1].setSpeed({'rpm': 60})
        this.steppers[1].setSteps(200)
        this.steppers[1].setStyle('single')
    }
}

module.exports = Motor
