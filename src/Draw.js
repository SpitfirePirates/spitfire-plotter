const Walker = require('./Walker')
const config = require('../config')
const PointCollection = require('./PointCollection')
const InvalidShapeException = require('./Exceptions/InvalidShapeException')

class Draw {
    constructor(plotter) {
        this.plotter = plotter
    }

    async drawPreset(name) {
        if (!config.shapes[name]) {
            throw new InvalidShapeException(`Shape '${name}' not found`)
        }
        let pointArray = config.shapes[name]
        const walker = new Walker(this.plotter)
        const pointCollection = (new PointCollection).fromArray(pointArray);

        pointCollection.translate(this.plotter.position.x, this.plotter.position.y)

        await walker.walk(pointCollection)
    }
}

module.exports = Draw
