'use strict'

const Plotter = require('./src/Plotter.js')
const Shapes = require('./src/Shapes.js')
const Walker = require('./src/Walker.js')

const plotter = new Plotter()
const walker = new Walker(plotter)

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

    await walker.walk(points)

    plotter.release()
}

run()
    .then(_ => {plotter.setStoredState()})
    .catch(e => {
        console.error(e);
        plotter.setStoredState();
    });
