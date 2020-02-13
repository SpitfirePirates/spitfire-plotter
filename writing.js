'use strict'

const Plotter = require('./src/Plotter.js')
const Writer = require('./src/Writer.js')

const plotter = new Plotter()

async function run () {

    await Writer.write("Hello world")

    plotter.release()
}

run()
