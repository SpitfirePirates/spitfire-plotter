
async function square() {
    await plotter.move(5000, 0)
    await plotter.move(0, 5000)
    await plotter.move(-5000, 0)
    await plotter.move(0, -5000)
}

async function circle(fraction) {
    var angle = 0,
        distance = 100,
        maxAngle = 360

    if (fraction) {
        maxAngle = maxAngle * fraction
    }

    while (angle < maxAngle) {
        angle += 1;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;
        await plotter.move(dx, dy)
    }
}

module.exports = {
    square: square,
    circle: circle
}
