const fs = require('fs').promises
const Walker = require('./Walker')
const config = require('../config')
const PointCollection = require('./PointCollection')
const InvalidShapeException = require('./Exceptions/InvalidShapeException')
const SVGPathInterpolator = require('svg-path-interpolator')

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
        const pointCollection = PointCollection.fromArray(pointArray);

        pointCollection.translate(this.plotter.position.x, this.plotter.position.y)

        await walker.walk(pointCollection)
    }

    async drawSvg(path, width = 3000) {
        const svg = await fs.readFile(path)

        const interpolator = new SVGPathInterpolator({
            joinPathData: true,
            minDistance: 1.5,
            roundToNearest: 0.25,
            sampleFrequency: 0.005
        })
        const pathData = interpolator.processSvg(svg)

        const points = []
        while (pathData.length > 1) {
            points.push({
                x: pathData.shift(),
                y: pathData.shift()
            })
        }

        const pointCollection = new PointCollection(points)
        const boundingBox = pointCollection.getBoundingBox()
        pointCollection.translate((boundingBox.x < 0 ? Math.abs(boundingBox.x) : 0), (boundingBox.y < 0 ? Math.abs(boundingBox.y) : 0))
        pointCollection.scale(width / boundingBox.width)
        pointCollection.translate(this.plotter.position.x, this.plotter.position.y)

        const walker = new Walker(this.plotter)
        await walker.walk(pointCollection)
    }
}

module.exports = Draw
