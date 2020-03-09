
async function square(plotter, length = 1000) {
    await plotter.move(length, 0)
    await plotter.move(0, length)
    await plotter.move(length * -1, 0)
    await plotter.move(0, length * -1)
}

async function diamond(length = 1000) {
    await plotter.move(length/2,0)
    await plotter.moveInterpolate(length/2, length/2)
    await plotter.moveInterpolate(-length/2, length/2)
    await plotter.moveInterpolate(-length/2, -length/2)
    await plotter.moveInterpolate(length/2, -length/2)
}

function* makeCircleIterator(distance = 100, fraction = 1) {
    let   angle = 0
    const maxAngle = 2 * Math.PI * fraction,
          steps = 100
    distance = distance * fraction

    while (angle < maxAngle) {
        yield [
            Math.cos(angle) * distance,
            Math.sin(angle) * distance
        ]
        angle += maxAngle / steps;
    }
    return
}

async function circle(size = 100, fraction = 1) {
    const circleIterator = makeCircleIterator(size, fraction)
    for (let [dx, dy] of circleIterator) {
        await plotter.move(dx, dy)
    }
}

module.exports = {
    square: square,
    circle: circle,
    diamond: diamond
}
