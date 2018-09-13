const { execFile } = require('child_process');

class Motor {

    constructor(length) {
        this.length = length
    }

    release() {
        return new Promise((resolve, reject) => {
            execFile(`release.py`, [this.pins.direction, this.pins.step], (error, stdout, stderr) => {
                error ? reject():resolve()
            });
        });
    }

    step(count, direction) {
        return new Promise((resolve, reject) => {
            execFile(`walk.py`, [this.pins.direction, this.pins.step, count, direction], (error, stdout, stderr) => {
                error ? reject():resolve()
            });
        });
    }
}

module.exports = Motor
