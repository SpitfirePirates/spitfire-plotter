'use strict'

const Plotter = require('./Plotter.js')
const Spyro = require('./Spyro.js')

const plotter = new Plotter()

async function run () {

    await Spyro.run({x: 500, y: 500}, 200)

    plotter.release()
}

run()
