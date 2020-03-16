'use strict'

const Plotter = require('./src/Plotter.js')
const Shapes = require('./src/Shapes.js')
const Walker = require('./src/Walker.js')

const plotter = new Plotter()
const walker = new Walker(plotter)

async function run () {

    await new Promise((resolve, reject) => {
        setTimeout(resolve, 3000);
    })

    await plotter.move(500, 1800);

    // await plotter.move(1000,0);
    // await plotter.move(0,1000);
    // await plotter.move(-1000,0);
    // await plotter.move(0,-1000);
    console.log('done')
    // console.log(111)
    // await plotter.move(4500,-2500);
}

run()
