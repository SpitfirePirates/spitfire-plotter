const LeftMotor  = require('./LeftMotor.js')
const RightMotor = require('./RightMotor.js')
const fs = require("fs");
const debug = (process.env.NODE_ENV !== 'production')
const pigpio = debug ? require('@rafaelquines/pigpio-mock') : require('pigpio')
const OutOfBoundsException = require('./Exceptions/OutOfBoundsException')
const DebugServer = require('./DebugServer.js');
const NanoTimer = require('nanotimer');

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

        const restoredState = this.getStoredState();

        this.position = restoredState.position;

        this.leftMotor = new LeftMotor(Math.sqrt(Math.pow(this.position.x, 2) + Math.pow(this.position.y, 2)))
        this.rightMotor = new RightMotor(Math.sqrt(Math.pow(this.board.width - this.position.x, 2) + Math.pow(this.position.y, 2)))

        this.addMoveEventHandler(position => console.log(position))

        if (debug) {
            new DebugServer(this);
        }
    }

    // move relative to the current position
    async move(x, y) {

        x = Math.round(x);
        y = Math.round(y);

        const absx = this.position.x + x
        const absy = this.position.y + y

        const drawLineSpeed = 0.2; //units / second

        const drawLine = [
            {x: this.position.x, y: this.position.y},
            {x: this.position.x+x, y: this.position.y+y},
        ]

        const drawLineXDelta = drawLine[0].x - drawLine[1].x;
        const drawLineYDelta = drawLine[0].y - drawLine[1].y;
        const drawLineLength = Math.sqrt(Math.pow(drawLineXDelta,2) + Math.pow(drawLineYDelta, 2));

        let drawLineLeftSlope = drawLineYDelta / drawLineXDelta;
        if (drawLineXDelta === 0) {
            drawLineLeftSlope = 0;
            // drawLineLeftYIntersect = drawLine[0].y;
        }
        let drawLineLeftYIntersect = drawLine[1].y - (drawLineLeftSlope * drawLine[1].x);

        let drawLineRightSlope = - drawLineYDelta / drawLineXDelta;
        if (drawLineXDelta === 0) {
            drawLineRightSlope = 0;
            // drawLineRightYIntersect = drawLine[0].y;
        }
        let drawLineRightYIntersect = drawLine[1].y - (drawLineRightSlope * (this.board.width - drawLine[1].x));


        const leftPerpendicularPoint = {
            x: -drawLineLeftSlope * drawLineLeftYIntersect/(Math.pow(drawLineLeftSlope,2) + 1),
            y: drawLineLeftYIntersect/(Math.pow(drawLineLeftSlope,2) + 1)
        };

        // console.log('drawline', drawLine);

        const leftPerpendicularPointDistance = Math.sqrt(Math.pow(leftPerpendicularPoint.x,2) + (Math.pow(leftPerpendicularPoint.y,2)));
        const leftStartPointDistance = Math.sqrt(Math.pow(drawLine[0].x,2) + (Math.pow(drawLine[0].y,2)));
        const leftEndPointDistance = Math.sqrt(Math.pow(drawLine[1].x,2) + (Math.pow(drawLine[1].y,2)));
        const leftStartAngle = Math.acos(leftPerpendicularPointDistance/leftStartPointDistance);
        const leftEndAngle = Math.acos(leftPerpendicularPointDistance/leftEndPointDistance);

        const rightPerpendicularPoint = {
            x: this.board.width - ((-drawLineRightSlope * drawLineRightYIntersect)/(Math.pow(drawLineRightSlope,2) + 1)),
            y: drawLineRightYIntersect/(Math.pow(drawLineRightSlope,2) + 1)
        };

        const rightPerpendicularPointDistance = Math.sqrt(Math.pow((this.board.width - rightPerpendicularPoint.x),2) + (Math.pow(rightPerpendicularPoint.y,2)));
        const rightStartPointDistance = Math.sqrt(Math.pow(this.board.width - drawLine[0].x,2) + (Math.pow(drawLine[0].y,2)));
        const rightEndPointDistance = Math.sqrt(Math.pow(this.board.width - drawLine[1].x,2) + (Math.pow(drawLine[1].y,2)));
        const rightStartAngle = Math.acos(rightPerpendicularPointDistance/rightStartPointDistance);
        const rightEndAngle = Math.acos(rightPerpendicularPointDistance/rightEndPointDistance);

        console.log('distancesR', rightStartPointDistance, rightPerpendicularPointDistance, rightEndPointDistance);
        console.log('distancesL', leftStartPointDistance, leftPerpendicularPointDistance, leftEndPointDistance);

        console.log('anglesR', rightStartAngle, rightEndAngle)
        console.log('anglesL', leftStartAngle, leftEndAngle)
        console.log('R perp point', rightPerpendicularPoint);
        console.log('L perp point', leftPerpendicularPoint);
        console.log('L line', drawLineLeftSlope, drawLineLeftYIntersect)
        console.log('R line', drawLineRightSlope, drawLineRightYIntersect)

        let precision = 1;

        let leftTotalTime = 0;
        let leftTotalDistance = 0;
        let rightTotalTime = 0;
        let rightTotalDistance = 0;
        const totalTime = drawLineLength / drawLineSpeed;
        
        let leftPrecision = precision;

        if (leftStartPointDistance > leftPerpendicularPointDistance && leftEndPointDistance > leftPerpendicularPointDistance) {
            leftPrecision *= 1;
        } else if (leftStartPointDistance > leftEndPointDistance) {
            leftPrecision *= -1;
        } else {
            leftPrecision *= 1;
        }

        const leftMotion = new Promise(async (resolve, reject) => {
            let currentDistanceAlongDrawLine = 0;
            let leftLength = Math.round(leftStartPointDistance);
            let done = false;

            // for (let i=0; i<100; i++) {
            while(done === false) {
                let distanceAlongMoveLine;
                leftLength += leftPrecision;

                if (leftPerpendicularPointDistance === 0) {
                    distanceAlongMoveLine = leftLength;

                    if (leftLength >= leftEndPointDistance) {
                        done = true;
                    }
                } else {
                    let newAngle = Math.acos(leftPerpendicularPointDistance/leftLength);
                    distanceAlongMoveLine = Math.tan(newAngle) * leftPerpendicularPointDistance;

                    if (isNaN(newAngle)) {
                        leftPrecision *= -1;
                        continue;
                    }

                    if (leftStartAngle > leftEndAngle) {
                        if (newAngle <= leftEndAngle) done = true;
                    } else {
                        if (newAngle >= leftEndAngle) done = true;
                    }
                }

                if (currentDistanceAlongDrawLine === 0) {
                    currentDistanceAlongDrawLine = distanceAlongMoveLine;
                    continue;
                }

                const moveDelta = distanceAlongMoveLine-currentDistanceAlongDrawLine;
                leftTotalDistance += moveDelta;
                const time = Math.abs((totalTime/drawLineLength) * moveDelta);
                leftTotalTime += time;
                const timer = new NanoTimer();
                // console.log(time);
                // console.log('L', `${leftLength}/${leftEndPointDistance}`, moveDelta, time);

                await new Promise(resolve1 => {
                    timer.setTimeout(
                        async _ => {
                            if (leftPrecision < 0) {
                                await this.leftMotor.reelIn(Math.abs(leftPrecision));
                            } else {
                                await this.leftMotor.reelOut(Math.abs(leftPrecision));
                            }

                            resolve1();
                        },
                        [],
                        `${time}m`
                    );
                })

                currentDistanceAlongDrawLine = distanceAlongMoveLine;
            }

            resolve();
        });


        let rightPrecision = precision;

        if (rightStartPointDistance > rightPerpendicularPointDistance && rightEndPointDistance > rightPerpendicularPointDistance) {
            rightPrecision *= -1;
        } else if (rightStartPointDistance > rightEndPointDistance) {
            rightPrecision *= 1;
        } else {
            rightPrecision *= 1;
        }

        const rightMotion = new Promise(async (resolve, reject) => {
            let currentDistanceAlongDrawLine = 0;
            let rightLength = Math.round(rightStartPointDistance);
            let done = false;

            // for (let i=0; i<100; i++) {
            while(done === false) {
                let distanceAlongMoveLine;
                rightLength += rightPrecision;

                if (rightPerpendicularPointDistance === 0) {
                    distanceAlongMoveLine = rightLength;

                    if (rightLength >= rightEndPointDistance) {
                        done = true;
                    }
                } else {
                    let newAngle = Math.acos(rightPerpendicularPointDistance/rightLength);
                    distanceAlongMoveLine = Math.tan(newAngle) * rightPerpendicularPointDistance;

                    if (isNaN(newAngle)) {


                        const moveDelta = Math.abs(currentDistanceAlongDrawLine*2);
                        rightTotalDistance += Math.abs(moveDelta);
                        const time = (totalTime/drawLineLength) * moveDelta;
                        rightTotalTime += time;
                        const timer = new NanoTimer();
                        // console.log('R', `${rightLength}/${rightEndPointDistance}`, moveDelta, time);

                        await new Promise(resolve1 => {
                            timer.setTimeout(
                                async _ => {

                                    resolve1();
                                },
                                [],
                                `${time}m`
                            );
                        })


                        rightPrecision *= -1;
                        continue;
                    }

                    if (rightStartAngle > rightEndAngle) {
                        if (newAngle <= rightEndAngle) done = true;
                    } else {
                        if (newAngle >= rightEndAngle) done = true;
                    }

                    // console.log(newAngle, rightEndAngle);
                }

                if (currentDistanceAlongDrawLine === 0) {
                    currentDistanceAlongDrawLine = distanceAlongMoveLine;
                    continue;
                }

                const moveDelta = Math.abs(distanceAlongMoveLine-currentDistanceAlongDrawLine);
                rightTotalDistance += Math.abs(moveDelta);
                const time = (totalTime/drawLineLength) * moveDelta;
                rightTotalTime += time;
                const timer = new NanoTimer();
                // console.log('R', `${rightLength}/${rightEndPointDistance}`, moveDelta, time);

                await new Promise(resolve1 => {
                    timer.setTimeout(
                        async _ => {
                            if (rightPrecision < 0) {
                                await this.rightMotor.reelIn(Math.abs(rightPrecision));
                            } else {
                                await this.rightMotor.reelOut(Math.abs(rightPrecision));
                            }

                            resolve1();
                        },
                        [],
                        `${time}m`
                    );
                })

                currentDistanceAlongDrawLine = distanceAlongMoveLine;
            }

            resolve();
        });

        // this.position.x = absx
        // this.position.y = absy

        await Promise.all([leftMotion, rightMotion]);

        console.log(totalTime, leftTotalTime, rightTotalTime);
        console.log(drawLineLength, leftTotalDistance, rightTotalDistance);

        return;


        this.position.x = absx
        this.position.y = absy

        return;







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
        let interpolationPrecision = Math.min(Math.abs(x),Math.abs(y));
        interpolationPrecision = Math.max(interpolationPrecision,1);

        if (interpolationPrecision > 10) {
            interpolationPrecision /=10;
        }

        for(let i=0;i<interpolationPrecision;i++) {
            await this.move(x/interpolationPrecision, y/interpolationPrecision);
        }
    }

    findCircleLineIntersections(r, h, k, m, n) {
        // circle: (x - h)^2 + (y - k)^2 = r^2
        // line: y = m * x + n
        // r: circle radius
        // h: x value of circle centre
        // k: y value of circle centre
        // m: slope
        // n: y-intercept

        // get a, b, c values
        var a = 1 + Math.pow(m,2);
        var b = -h * 2 + (m * (n - k)) * 2;
        var c = Math.pow(h,2) + Math.pow((n - k),2) - Math.pow(r,2);

        // get discriminant
        var d = Math.pow(b,2) - 4 * a * c;
        if (d >= 0) {
            // insert into quadratic formula
            var intersections = [
                (-b + Math.sqrt(Math.pow(b,2) - 4 * a * c)) / (2 * a),
                (-b - Math.sqrt(Math.pow(b,2) - 4 * a * c)) / (2 * a)
            ];
            if (d == 0) {
                // only 1 intersection
                return [intersections[0]];
            }
            return intersections;
        }
        // no intersection
        return [];
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
