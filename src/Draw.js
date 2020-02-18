const Walker = require('./Walker')
const config = require('../config')
const InvalidShapeException = require('./Exceptions/InvalidShapeException')

class Draw {
    constructor(plotter) {
        this.plotter = plotter
    }

    async drawPreset(name) {
        if (!config.shapes[name]) {
            throw new InvalidShapeException(`Shape '${name}' not found`)
        }
        let points = config.shapes[name]

        const walker = new Walker(this.plotter)
        points = walker.arrayToObjects(points)
        points = walker.translatePoints(points, this.plotter.position.x, this.plotter.position.y)

        await walker.walk(points)
    }
}

module.exports = Draw
