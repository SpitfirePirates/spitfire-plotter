const ws = require('socket.io')

class DebugServer {
    constructor(plotter) {
        this.server = ws(3000)

        this.pointHistory = []

        this.server.on('connection', socket => {
            socket.emit('history', this.pointHistory)
        })

        plotter.addMoveEventHandler((position, leftHypo, rightHypo) => {
            this.pointHistory.push(position)
        })

        plotter.addMoveEventHandler((position, leftHypo, rightHypo) => {
            this.server.emit('move', position)
        })

        plotter.addTerminateEventHandler(_ => {
            this.terminate()
        })

        this.pointHistory.push(plotter.position)
    }

    terminate() {
        this.server.close()
    }
}

module.exports = DebugServer
