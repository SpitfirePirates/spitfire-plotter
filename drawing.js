'use strict'

const Plotter = require('./src/Plotter.js')
const Shapes = require('./src/Shapes.js')
const Walker = require('./src/Walker.js')
const config = require('./config')

const plotter = new Plotter()

async function run () {

    let points = config.shapes.ubuntu

    points = Walker.arrayToObjects(points)
    // Move to section of board
    points = Walker.translatePoints(points, 0, 200)

    await Walker.walk(plotter, points)

    plotter.release()
}

run()
    .then(_ => {plotter.setStoredState()})
    .catch(e => {
        console.error(e);
        plotter.setStoredState();
    });
