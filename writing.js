'use strict'

const Plotter = require('./src/Plotter.js')
const Writer = require('./src/Writer.js')

const plotter = new Plotter()
const writer = new Writer(plotter)

async function run () {

    await writer.write("Hello world")

    plotter.release()
}

run()
