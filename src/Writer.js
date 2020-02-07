const Plotter = require('./Plotter.js')
const plotter = new Plotter()
const TextToSVG = require('text-to-svg');
const SVGPathInterpolator = require('svg-path-interpolator')
const InvalidTextException = require('./Exceptions/InvalidTextException')

function* makeWriteIterator(text) {
    const points = textToPoints(text)
    while (points.length > 0) {
        yield {
            dx: points.shift() - plotter.position.x,
            dy: points.shift() - plotter.position.y
        }
    }

    return
}

async function write(text) {
    if (!text) {
        throw new InvalidTextException();
    }
    const walkIterator = makeWriteIterator(text)
    for (let {dx, dy} of walkIterator) {
        await plotter.move(dx, dy)
    }
}

function textToPoints(text) {
    const textToSVG = TextToSVG.loadSync();

    const attributes = {fill: 'red', stroke: 'black'};
    const options = {x: 0, y: 0, fontSize: 672, anchor: 'top', attributes: attributes};

    const svg = textToSVG.getPath(text, options);

    const interpolator = new SVGPathInterpolator({
        joinPathData: true,
        minDistance: 0.5,
        roundToNearest: 0.25,
        sampleFrequency: 0.001
    });
    const pathData = interpolator.processSvg(svg)

    return pathData
}

module.exports = {
    write: write,
}
