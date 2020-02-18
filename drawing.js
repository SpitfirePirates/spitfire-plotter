'use strict'

const Plotter = require('./src/Plotter.js')
const Draw = require('./src/Draw.js')

const plotter = new Plotter()

async function run () {

    await Draw.drawPreset(plotter, 'ubuntu')

    plotter.release()
}

run()
    .then(_ => {plotter.setStoredState()})
    .catch(e => {
        console.error(e);
        plotter.setStoredState();
    });
