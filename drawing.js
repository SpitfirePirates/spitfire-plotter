'use strict'

const Plotter = require('./src/Plotter.js')
const Draw = require('./src/Draw.js')

const plotter = new Plotter()
const draw = new Draw(plotter)

async function run () {

    // await draw.drawPreset('ubuntu')
    await plotter.move(500, 500)
    await draw.drawSvg(__dirname + '/storage/test.svg')
}

run();
