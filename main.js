'use strict'

const Plotter = require('./src/Plotter.js')
const Shapes = require('./src/Shapes.js')
const Walker = require('./src/Walker.js')

const plotter = new Plotter()

async function run () {

    // shapes.square();

    // await Shapes.circle(10, 0.5)
    // await Shapes.circle(10, 0.5)
    // await Shapes.circle(10, 0.5)
    // await Shapes.circle(10, 0.5)
    
    //await Walker.walkToCenter()

    const points = [
        { x: 100, y: 100},
        { x: 200, y: 200},
        { x: 800, y: 200},
        { x: 800, y: 600}
    ]

    await Walker.walk(points)

    plotter.release()
}

run()
