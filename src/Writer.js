const Plotter = require('./Plotter.js')
const plotter = new Plotter()
const TextToSVG = require('text-to-svg')
const SVGPathInterpolator = require('svg-path-interpolator')
const InvalidTextException = require('./Exceptions/InvalidTextException')

function* makeWriteIterator(text, size) {
    const starty = plotter.position.y
    const characters = text.split('')
    while (characters.length > 0) {
        const character = characters.shift()
        const points = textToPoints(character, size, {x: plotter.position.x, y: starty})
        while (points.length > 0) {
            yield {
                dx: points.shift() - plotter.position.x,
                dy: points.shift() - plotter.position.y
            }
        }
    }

    return
}

async function write(text, size) {
    if (!text) {
        throw new InvalidTextException()
    }
    if (!size) {
        size = 672
    }
    const walkIterator = makeWriteIterator(text, size)
    for (let {dx, dy} of walkIterator) {
        await plotter.move(dx, dy)
    }
}

function textToPoints(text, size, position) {
    const textToSVG = TextToSVG.loadSync(__dirname + '/../resources/font-ems-delight.ttf')
    const attributes = {fill: 'red', stroke: 'black'}
    const options = {x: position.x, y: position.y, fontSize: size, anchor: 'top', attributes: attributes}

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

module.exports = {
    write: write,
}
