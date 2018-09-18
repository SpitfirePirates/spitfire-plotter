'use strict'

const Plotter = require('./Plotter.js')
const Shapes = require('./Shapes.js')
const Walker = require('./Walker.js')

const plotter = new Plotter()

async function run () {

    // shapes.square();

    // await Shapes.circle(10, 0.5)
    // await Shapes.circle(10, 0.5)
    // await Shapes.circle(10, 0.5)
    // await Shapes.circle(10, 0.5)

    const points = [
        { x: 100, y: 100},
        { x: 200, y: 200},
        { x: 800, y: 200},
        { x: 800, y: 600}
    ]

    await Walker.walkToCenter()
    await Shapes.circle(10, 1)

    await Walker.walkToCenter()
    await Shapes.square(100, 1)

    await Walker.walkToCenter()
    await Walker.walk(points)

    plotter.release()
}

run()
