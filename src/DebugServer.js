const ws = require('socket.io')

class DebugServer {
    constructor(plotter) {
        this.server = ws(3000)

        this.pointHistory = []

        this.server.on('connection', socket => {
            let position = 0;
            socket.on('getPoints', (options, fn) => {
                const points = this.pointHistory.slice(position, position+options.count);

                position += points.length;
                fn(points);
            });
        });

        // plotter.addMoveEventHandler((position, leftHypo, rightHypo) => {
        //     this.pointHistory.push(Object.assign({}, position))
        // })

        plotter.rightMotor.addStepEventHandler((length) => {
            let position = calcPoint(plotter.leftMotor.length, plotter.rightMotor.length, plotter.board.width);
            // console.log('right', position, plotter.leftMotor.length, plotter.rightMotor.length);
            this.pointHistory.push(Object.assign({}, position))
        })

        plotter.leftMotor.addStepEventHandler((length) => {
            let position = calcPoint(plotter.leftMotor.length, plotter.rightMotor.length, plotter.board.width);
            // console.log('left', position, plotter.leftMotor.length, plotter.rightMotor.length);
            this.pointHistory.push(Object.assign({}, position))
        })


        function calcPoint(leftLength, rightLength, boardWidth) {
            let x = (Math.pow(leftLength, 2) - Math.pow(rightLength, 2) + Math.pow(boardWidth, 2)) / (2 * boardWidth);
            let y = Math.sqrt(Math.pow(leftLength, 2) - Math.pow(x, 2));

            return {x: Math.round(x), y: Math.round(y)};
        }

        plotter.addTerminateEventHandler(_ => {
            this.terminate()
        })

        this.pointHistory.push(Object.assign({}, plotter.position))
    }

    terminate() {
        this.server.close()
    }
}

module.exports = DebugServer
