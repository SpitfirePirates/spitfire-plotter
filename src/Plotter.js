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

        this.leftMotor = new LeftMotor(0)
        this.rightMotor = new RightMotor(this.board.width)

        const restoredState = this.getStoredState();

        this.position = restoredState.position;

        this.addMoveEventHandler(position => console.log(position))

        if (debug) {
            new DebugServer(this);
        }
    }

    // move relative to the current position
    async move(x, y) {

        x = Math.round(x);
        y = Math.round(y);

        const drawLine = [
            {x: this.position.x, y: this.position.y},
            {x: this.position.x+x, y: this.position.y+y},
        ]

        const drawLineXDelta = drawLine[1].x - drawLine[0].x;
        const drawLineYDelta = drawLine[1].y - drawLine[0].y;

        const drawLineSlope = drawLineYDelta / drawLineXDelta;
        const drawLineYIntersect = drawLine[1].y - (drawLineSlope * drawLine[1].x);

        const drawLineRightSlope = drawLineYDelta / (this.board.width - drawLineXDelta);
        const drawLineRightYIntersect = drawLine[1].y - (drawLineSlope * (this.board.width - drawLine[1].x));

        // const drawLineLength = Math.sqrt(Math.pow(drawLineXDelta,2) + Math.pow(drawLineYDelta,2));
        //
        //
        // const segmentLengths = [];
        //
        // const segments = [];
        // // const segmentsTotal = Math.ceil(drawLineLength);
        // const segmentsTotal = 15;
        // for(let segmentNumber = 0; segmentNumber < segmentsTotal; segmentNumber++) {
        //     segmentLengths.push({left: null, right: null});
        //
        //     if (segments.length === 0) {
        //         segments.push(drawLine[0]);
        //
        //         continue;
        //     }
        //
        //     const lastSegment = segments[segments.length - 1];
        //
        //     segments.push({x: lastSegment.x + (drawLineXDelta / segmentsTotal),y: lastSegment.y + (drawLineYDelta / segmentsTotal)});
        // }

        const drawLineMinLeftPoint = {
            x: (-drawLineSlope * drawLineYIntersect)/(Math.pow(drawLineSlope,2) + 1),
            y: drawLineYIntersect/(Math.pow(drawLineSlope,2) + 1)
        };

        const leftStartAngle = Math.atan(drawLine[0].x/drawLine[0].y);
        const leftEndAngle = Math.atan(drawLine[1].x/drawLine[1].y);
        const leftMinPointDistance = Math.sqrt(Math.pow(drawLineMinLeftPoint.x,2) + (Math.pow(drawLineMinLeftPoint.x,2)));

        const drawLineMinRightPoint = {
            x: (-drawLineRightSlope * drawLineRightYIntersect)/(Math.pow(drawLineRightSlope,2) + 1),
            y: drawLineRightYIntersect/(Math.pow(drawLineRightSlope,2) + 1)
        };

        const rightStartAngle = Math.atan((this.board.width - drawLine[0].x)/drawLine[0].y);
        const rightEndAngle = Math.atan((this.board.width - drawLine[1].x)/drawLine[1].y);
        const rightMinPointDistance = Math.sqrt(Math.pow((this.board.width - drawLineMinRightPoint.x),2) + (Math.pow((this.board.width - drawLineMinRightPoint.x),2)));

        const minStep = 1;
        let i, newLength,lastLength,stepSize;

        for (i=0;i<1; i+=0.001) {
            const leftNewLength = (leftMinPointDistance/Math.cos(leftStartAngle+i));
            const rightNewLength = (rightMinPointDistance/Math.cos(rightStartAngle+i));

            if (typeof lastLength === 'undefined') {
                lastLength = leftNewLength;
                continue;
            }

            stepSize = lastLength-leftNewLength;

            if (Math.abs(stepSize) >= minStep) {
                break;
            }

            // lastLength = newLength;
        }

        console.log(i, stepSize);




        // const leftMotorToCentreOfDrawLine = [
        //     {x: 0,y: 0},
        //     // {
        //     //     x: (Math.abs(drawLineXDelta)/2) + Math.min(drawLine[0].x,drawLine[1].x),
        //     //     y: (Math.abs(drawLineYDelta)/2) + Math.min(drawLine[0].y,drawLine[1].y),
        //     // },
        //     drawLineMinLeftPoint
        // ];

        //
        // const leftMotorToCentreOfDrawLineXDelta = leftMotorToCentreOfDrawLine[0].x - leftMotorToCentreOfDrawLine[1].x;
        // const leftMotorToCentreOfDrawLineYDelta = leftMotorToCentreOfDrawLine[0].y - leftMotorToCentreOfDrawLine[1].y;
        //
        // const leftMotorToCentreOfDrawLineLength = Math.sqrt(Math.pow(leftMotorToCentreOfDrawLineXDelta,2) + Math.pow(leftMotorToCentreOfDrawLineYDelta,2));
        //
        // const leftCircleCentre = {
        //     x: leftMotorToCentreOfDrawLine[1].x / 2,
        //     y: leftMotorToCentreOfDrawLine[1].y / 2,
        // };
        //
        // const leftCircleRadius = leftMotorToCentreOfDrawLineLength;

        // console.log(leftCircleRadius)





        // const rightMotorToCentreOfDrawLine = [
        //     {x: this.board.width,y: 0},
        //     // {
        //     //     x: (Math.abs(drawLineXDelta)/2) + Math.min(drawLine[0].x, drawLine[1].x),
        //     //     y: (Math.abs(drawLineYDelta)/2) + Math.min(drawLine[0].y, drawLine[1].y),
        //     // },
        //     drawLineMinRightPoint
        // ];
        //
        // const rightMotorToCentreOfDrawLineXDelta = rightMotorToCentreOfDrawLine[0].x - rightMotorToCentreOfDrawLine[1].x;
        // const rightMotorToCentreOfDrawLineYDelta = rightMotorToCentreOfDrawLine[0].y - rightMotorToCentreOfDrawLine[1].y;
        //
        // const rightMotorToCentreOfDrawLineLength = Math.sqrt(Math.pow(rightMotorToCentreOfDrawLineXDelta,2) + Math.pow(rightMotorToCentreOfDrawLineYDelta,2));
        //
        // const rightCircleCentre = {
        //     x: rightMotorToCentreOfDrawLine[1].x / 2,
        //     y: rightMotorToCentreOfDrawLine[1].y / 2,
        // };
        //
        // const rightCircleRadius = rightMotorToCentreOfDrawLineLength /2;






        // let leftSegmentCount = 0;
        // segments.forEach(segment => {
        //     const leftMotorToDrawLineLength = Math.sqrt(Math.pow(segment.x,2) + Math.pow(segment.y,2));
        //     const leftMotorToDrawLineSlope = segment.y / segment.x;
        //     const leftMotorToDrawLineYIntercept = segment.y - (leftMotorToDrawLineSlope * segment.x);
        //
        //     const leftMotorToCircleXs = this.findCircleLineIntersections(leftCircleRadius, leftCircleCentre.x, leftCircleCentre.y, leftMotorToDrawLineSlope, leftMotorToDrawLineYIntercept)
        //     const leftMotorToCircleX = Math.max(...leftMotorToCircleXs);
        //
        //     const leftMotorToCircleY = leftMotorToDrawLineSlope * leftMotorToCircleX + leftMotorToDrawLineYIntercept;
        //
        //     let leftIntersectLength = Math.sqrt(Math.pow(leftMotorToCircleX,2) + Math.pow(leftMotorToCircleY,2));
        //
        //     if (isNaN(leftIntersectLength)) {
        //         leftIntersectLength = 0;
        //     }
        //
        //     const leftLengthDelta = leftMotorToDrawLineLength - leftIntersectLength;
        //
        //     segmentLengths[leftSegmentCount].left = Math.abs(leftLengthDelta);
        //
        //     leftSegmentCount++;
        // });
        //
        //
        //
        // let rightSegmentCount = 0;
        // segments
        //     .map(({x, y}) => {
        //         return {x: this.board.width - x, y: y};
        //     })
        //     .forEach(segment => {
        //         const rightMotorToDrawLineLength = Math.sqrt(Math.pow(segment.x,2) + Math.pow(segment.y,2));
        //         const rightMotorToDrawLineSlope = segment.y / segment.x;
        //         const rightMotorToDrawLineYIntercept = segment.y - (rightMotorToDrawLineSlope * segment.x);
        //
        //         const rightMotorToCircleXs = this.findCircleLineIntersections(rightCircleRadius, rightCircleCentre.x, rightCircleCentre.y, rightMotorToDrawLineSlope, rightMotorToDrawLineYIntercept)
        //         const rightMotorToCircleX = Math.max(...rightMotorToCircleXs);
        //
        //         const rightMotorToCircleY = rightMotorToDrawLineSlope * rightMotorToCircleX + rightMotorToDrawLineYIntercept;
        //
        //         const rightIntersectLength = Math.sqrt(Math.pow(rightMotorToCircleX,2) + Math.pow(rightMotorToCircleY,2));
        //
        //         const rightLengthDelta = rightMotorToDrawLineLength - rightIntersectLength;
        //
        //         segmentLengths[rightSegmentCount].right = Math.abs(rightLengthDelta);
        //
        //         rightSegmentCount++
        //     });
        //
        // console.log(segmentLengths);
        //
        // for(let moveNumber = 1; moveNumber < segmentLengths.length; moveNumber++) {
        //
        //     let leftDelta = segmentLengths[moveNumber-1].left - segmentLengths[moveNumber].left;
        //     let rightDelta = segmentLengths[moveNumber].right - segmentLengths[moveNumber-1].right;
        //
        //     console.log(leftDelta, rightDelta);
        //
        //     const moveTime = 1000;
        //
        //     let leftMove, rightMove;
        //
        //     if (leftDelta < 0) {
        //         leftMove = this.leftMotor.reelOut(Math.abs(leftDelta), moveTime/Math.abs(leftDelta));
        //     } else {
        //         leftMove = this.leftMotor.reelIn(Math.abs(leftDelta), moveTime/Math.abs(leftDelta));
        //     }
        //
        //     if (rightDelta > 0) {
        //         rightMove = this.rightMotor.reelOut(Math.abs(rightDelta), moveTime/Math.abs(rightDelta));
        //     } else {
        //         rightMove = this.rightMotor.reelIn(Math.abs(rightDelta), moveTime/Math.abs(rightDelta));
        //     }
        //
        //     await Promise.all([leftMove,rightMove])
        //
        //     // console.log(this.leftMotor.length, this.rightMotor.length)
        // }



        const absx = this.position.x + x
        const absy = this.position.y + y

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
