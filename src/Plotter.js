const LeftMotor  = require('./LeftMotor.js')
const RightMotor = require('./RightMotor.js')
const fs = require("fs");
const debug = (process.env.NODE_ENV !== 'production')
const pigpio = debug ? require('@rafaelquines/pigpio-mock') : require('pigpio')
const OutOfBoundsException = require('./Exceptions/OutOfBoundsException')
const DebugServer = require('./DebugServer.js');

class Plotter
{
    constructor() {
        pigpio.initialize();
        process.on('exit', (code) => {
            this.terminate();
        });
        process.on('SIGINT', _ => {
            process.exit();
        });
        process.on('unhandledRejection', (reason, p) => {
            console.error(reason)
            process.exit();
        })

        this.moveEventHandlers = []
        this.terminateEventHandlers = []
        this.microsteppingMultiplier = 4;

        // const motorDistance = 600; //mm
        // const gearDiameter = 49.81; //mm
        // const gearCircumference = Math.PI*gearDiameter; //mm
        // const motorDistanceRotations = motorDistance/gearCircumference;
        // const boardWidthSteps = (motorDistanceRotations/motorDistance) * 4076; //steps

        this.board = { width: 1875*this.microsteppingMultiplier, height: 1100*this.microsteppingMultiplier }

        this.leftMotor = new LeftMotor()
        this.rightMotor = new RightMotor()

        const restoredState = this.getStoredState();

        this.position = restoredState.position;

        // this.addMoveEventHandler(position => console.log(position))

        if (debug) {
            new DebugServer(this);
        }
    }

    // move relative to the current position
    move(x, y) {

        x = Math.round(x);
        y = Math.round(y);

        const absx = this.position.x + x
        const absy = this.position.y + y

        // console.log(absx,absy)

        if (absx < 0 || absx > this.board.width || absy < 0 || absy > this.board.height) {
            throw new OutOfBoundsException();
        }

        const currentLeftHypo = Math.round(Math.hypot(this.position.x, this.position.y))
        const currentRightHypo = Math.round(Math.hypot(this.board.width - this.position.x, this.position.y))

        const leftHypo = Math.round(Math.hypot(absx, absy))
        const rightHypo = Math.round(Math.hypot(this.board.width - absx, absy))

        let rightLengthDelta = Math.round(Math.abs(rightHypo - currentRightHypo));
        let leftLengthDelta = Math.round(Math.abs(leftHypo - currentLeftHypo));

        let rightMove;
        let leftMove;

        let rightSpeed;
        let leftSpeed;

        if (rightLengthDelta > leftLengthDelta) {
            rightSpeed = 1;
            leftSpeed = leftLengthDelta/rightLengthDelta;
        } else {
            leftSpeed = 1;
            rightSpeed = rightLengthDelta/leftLengthDelta;
        }

        if(leftHypo > currentLeftHypo) {
            leftMove = this.leftMotor.reelOut(leftLengthDelta, leftSpeed)
        } else {
            leftMove = this.leftMotor.reelIn(leftLengthDelta, leftSpeed)
        }

        if(rightHypo > currentRightHypo) {
            rightMove = this.rightMotor.reelOut(rightLengthDelta, rightSpeed)
        } else {
            rightMove = this.rightMotor.reelIn(rightLengthDelta, rightSpeed)
        }

        this.position.x = absx
        this.position.y = absy

        this.onMove(this.position, leftHypo, rightHypo)

        return Promise.all([leftMove,rightMove])
    }

    async moveInterpolate(x,y) {
        // let interpolationPrecision = Math.min(Math.abs(x),Math.abs(y));
        // if (interpolationPrecision === 0) {
        //     // interpolationPrecision = Math.max(Math.abs(x),Math.abs(y));
        // } else {
        //     interpolationPrecision = Math.max(interpolationPrecision, 1);
        // }
        //
        // if (interpolationPrecision > 10) {
        //     interpolationPrecision /=10;
        // }
        //
        // interpolationPrecision = Math.ceil(interpolationPrecision);

        let dx;
        let dy;
        if (Math.abs(x) > Math.abs(y)) {
            dx = Math.abs(x) / Math.abs(y)
            dy = 1
        } else {
            dx = 1
            dy = Math.abs(y) / Math.abs(x)
        }

        dx = Math.max(dx,1);
        dy = Math.max(dy,1);

        if (isNaN(dy)) {
            dy = 1;
        }
        if (isNaN(dx)) {
            dx = 1;
        }

        const jumpLength = Math.hypot(dx,dy);
        const jumps = Math.hypot(x,y)/jumpLength

        // const segment = longDistance/smallDistance;
        //
        // // const ratio = (Math.abs(x) > Math.abs(y)) ? x/y:y/x
        // const ratio = x/y
        // const smallTriangleHypo = Math.hypot(1,ratio)
        //
        // const jumps = Math.hypot(x,y)/smallTriangleHypo;

        console.log(this.position, {x,y}, {dx,dy}, Math.min(x,y))

        for(let i=0;i<=Math.min(x,y);i++) {
            let x1 = Math.floor(dx);
            let y1 = Math.floor(dy);

            // console.log({i, x1, y1})

            await this.move(x1, y1);
        }
    }

    async home() {
        await this.move(-this.position.x, -this.position.y);
    }

    // release() {
    //     this.leftMotor.release()
    //     this.rightMotor.release()
    // }

    addMoveEventHandler(callback) {
        this.moveEventHandlers.push(callback);
    }

    onMove(newPosition, leftHypo, rightHypo) {
        this.moveEventHandlers.forEach(handler => handler(newPosition, leftHypo, rightHypo))
    }

    setStoredState() {
        console.log('Saving state...')
        const state = {
            'position': this.position,
        };

        fs.writeFileSync('state.json', JSON.stringify(state));
    }

    getStoredState() {

        try {
            fs.accessSync('state.json', fs.constants.R_OK | fs.constants.W_OK);

            return JSON.parse(fs.readFileSync('state.json'))
        } catch (err) {
            return {
                'position': {
                    'x': 0,
                    'y': 0
                },
            };
        }

    }

    terminate() {
        this.setStoredState();
        pigpio.terminate();
        this.terminateEventHandlers.forEach(handler => handler())
    }

    addTerminateEventHandler(callback) {
        this.terminateEventHandlers.push(callback);
    }
}

module.exports = Plotter
