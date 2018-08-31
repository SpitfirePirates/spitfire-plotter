'use strict'

const Plotter = require('./Plotter.js')

const plotter = new Plotter()

async function square() {
    await plotter.move(5000, 0);
    await plotter.move(0, 5000);
    await plotter.move(-5000, 0);
    await plotter.move(0, -5000);
}

square();

