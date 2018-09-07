const Plotter = require('./Plotter.js')
const plotter = new Plotter()

async function square() {
    await plotter.move(5000, 0)
    await plotter.move(0, 5000)
    await plotter.move(-5000, 0)
    await plotter.move(0, -5000)
}

function* makeCircleIterator(distance = 100, fraction = 1) {
    let   angle = 0
    const maxAngle = 2 * Math.PI * fraction,
          steps = 100

    while (angle < maxAngle) {
        yield [
            Math.cos(angle) * distance,
            Math.sin(angle) * distance
        ]
        angle += maxAngle / steps;
    }
    return
}

async function circle(fraction = 1) {
    const circleIterator = makeCircleIterator(100, fraction)
    for (let [dx, dy] of circleIterator) {
        await plotter.move(dx, dy)
    }
}

module.exports = {
    square: square,
    circle: circle
}
