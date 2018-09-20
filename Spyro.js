const Plotter = require('./Plotter.js')
const plotter = new Plotter()

function* makeSpyroIterator(centerPosition, radius) {
    let angle = 0

    while(1) {
        angle += (Math.PI * 2 / 1000)

        let position = adjustByCircle(centerPosition, radius, (Math.PI * 2 / 1000))
        position = adjustByCircle(position, radius / 5, (Math.PI * 2 / 800))

        yield {
            dx: position.x - plotter.position.x,
            dy: position.y - plotter.position.y
        }
    }
    return
}

async function run(centerPosition, radius) {
    const walkIterator = makeSpyroIterator(centerPosition, radius)
    for (let {dx, dy} of walkIterator) {
        await plotter.move(dx, dy)
    }
}

function adjustByCircle(center, radius, angle) {
    console.log('adjust', center, radius, angle)
    return {
        x: center.x + (radius * Math.cos(angle)),
        y: center.y + (radius * Math.sin(angle))
    }
}

module.exports = {
    run: run
}
