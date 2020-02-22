'use strict'

const Plotter = require('./src/Plotter.js')
const Draw = require('./src/Draw.js')

const plotter = new Plotter()
const draw = new Draw(plotter)

async function run () {

    await draw.drawPreset('ubuntu')

    plotter.release()
}

run();
