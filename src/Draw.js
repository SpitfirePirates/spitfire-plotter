const Walker = require('./Walker')
const config = require('../config')
const InvalidShapeException = require('./Exceptions/InvalidShapeException')

async function drawPreset(plotter, name) {
    if (!config.shapes[name]) {
        throw new InvalidShapeException(`Shape '${name}' not found`)
    }
    points = config.shapes[name]
    points = Walker.arrayToObjects(points)
    points = Walker.translatePoints(points, plotter.position.x, plotter.position.y)

    await Walker.walk(plotter, points)
}

module.exports = {
    drawPreset: drawPreset,
}
