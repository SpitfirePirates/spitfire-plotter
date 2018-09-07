'use strict'

const Plotter = require('./Plotter.js')
const Shapes = require('./Shapes.js')

const plotter = new Plotter()

async function run () {

    // shapes.square();

    await Shapes.circle(10, 0.5)
    await Shapes.circle(10, 0.5)
    await Shapes.circle(10, 0.5)
    await Shapes.circle(10, 0.5)

    plotter.release()
}

run()
