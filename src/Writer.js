const TextToSVG = require('text-to-svg')
const SVGPathInterpolator = require('svg-path-interpolator')
const InvalidTextException = require('./Exceptions/InvalidTextException')

class Writer {
    constructor(plotter) {
        this.plotter = plotter
        this.startPosition = plotter.position
        this.fontSize = 672
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

    async write(text) {
        if (!text) {
            throw new InvalidTextException()
        }
        this.startPosition = this.plotter.position
        const walkIterator = this.makeWriteIterator(text, this.fontSize)
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
            minDistance: 1.5,
            roundToNearest: 0.25,
            sampleFrequency: 0.005
        })
        const pathData = interpolator.processSvg(svg)

        return pathData
    }

    getLineHeight() {
        return this.fontSize
    }

    setFontSize(size) {
        this.fontSize = size
    }

    async carriageReturn() {
        const dx = this.startPosition.x - this.plotter.x
        const dy = this.getLineHeight()
        await this.plotter.move(dx, dy)
    }
}

module.exports = Writer
