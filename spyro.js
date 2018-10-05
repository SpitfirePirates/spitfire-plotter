'use strict'

const Plotter = require('./src/Plotter')
const Spyro = require('./src/Spyro.js')

const plotter = new Plotter()

async function run () {

    await Spyro.run({x: plotter.board.width/2, y: plotter.board.height/2}, 200)

    plotter.release()
}

run()
