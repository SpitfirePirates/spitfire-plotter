'use strict'

const Plotter = require('./src/Plotter.js')

const plotter = new Plotter()

function* makeShizzleIterator() {
    const circleCenter = { x: plotter.board.width / 2, y: plotter.board.height / 2 }
    const radius = 200

    while (1) {
        let angle = Math.random() * 2 * Math.PI;
        let newPos = {
            x: circleCenter.x + Math.cos(angle) * (radius),
            y: circleCenter.y + Math.sin(angle) * (radius)
        }
        yield {
            dx: newPos.x - plotter.position.x,
            dy: newPos.y - plotter.position.y,
        }
    }
    return
}

async function run () {
    const shizzleIterator = makeShizzleIterator()
    for (let {dx, dy} of shizzleIterator) {
        await plotter.move(dx, dy)
    }

    shizzle()
}

run()
