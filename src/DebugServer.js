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

        plotter.addMoveEventHandler((position, leftHypo, rightHypo) => {
            this.pointHistory.push(Object.assign({}, position))
        })

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
