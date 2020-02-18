const TextToSVG = require('text-to-svg')
const SVGPathInterpolator = require('svg-path-interpolator')
const InvalidTextException = require('./Exceptions/InvalidTextException')

class Writer {
    constructor(plotter) {
        this.plotter = plotter
    }

    * makeWriteIterator(text, size) {
        const points = this.textToPoints(text, size)
        while (points.length > 0) {
            yield {
                dx: points.shift() - this.plotter.position.x,
                dy: points.shift() - this.plotter.position.y
            }
        }

        return
    }

    async write(text, size) {
        if (!text) {
            throw new InvalidTextException()
        }
        if (!size) {
            size = 672
        }
        const walkIterator = this.makeWriteIterator(text, size)
        for (let {dx, dy} of walkIterator) {
            await this.plotter.move(dx, dy)
        }
    }

    textToPoints(text, size) {
        const textToSVG = TextToSVG.loadSync(__dirname + '/../resources/font-ems-delight.ttf')
        const attributes = {fill: 'red', stroke: 'black'}
        const options = {x: 0, y: 0, fontSize: size, anchor: 'top', attributes: attributes}

        const svg = textToSVG.getPath(text, options)

        const interpolator = new SVGPathInterpolator({
            joinPathData: true,
            minDistance: 0.5,
            roundToNearest: 0.25,
            sampleFrequency: 0.001
        })
        const pathData = interpolator.processSvg(svg)

        return pathData
    }
}

module.exports = Writer
