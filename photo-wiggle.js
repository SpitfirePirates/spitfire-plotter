'use strict'

const Plotter = require('./src/Plotter.js')
const Photo = require('./src/Photo.js')

const plotter = new Plotter()

async function run () {

    const photo = new Photo(plotter, __dirname + '/storage/photo2.jpg')
    photo.useColour = true

    await plotter.home()
    await plotter.move(500, 200)
    await photo.drawWiggle()
}

run();
