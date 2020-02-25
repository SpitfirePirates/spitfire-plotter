'use strict'

const Plotter = require('./src/Plotter.js')
const Walker = require('./src/Walker.js')
const PointCollection = require('./src/PointCollection.js')

const plotter = new Plotter()
const walker = new Walker(plotter)

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

async function run () {

    // shapes.square();

    // await Shapes.circle(10, 0.5)
    // await Shapes.circle(10, 0.5)
    // await Shapes.circle(10, 0.5)
    // await Shapes.circle(10, 0.5)
    
    //await Walker.walkToCenter()

    let points1 = [
        { x: 0, y: 0},
        { x: getRandomInt(plotter.board.width), y: getRandomInt(plotter.board.height)},
        { x: getRandomInt(plotter.board.width), y: getRandomInt(plotter.board.height)},
        { x: getRandomInt(plotter.board.width), y: getRandomInt(plotter.board.height)},
        { x: getRandomInt(plotter.board.width), y: getRandomInt(plotter.board.height)},
        { x: getRandomInt(plotter.board.width), y: getRandomInt(plotter.board.height)},
        { x: getRandomInt(plotter.board.width), y: getRandomInt(plotter.board.height)},
        { x: getRandomInt(plotter.board.width), y: getRandomInt(plotter.board.height)},
        { x: getRandomInt(plotter.board.width), y: getRandomInt(plotter.board.height)},
        { x: getRandomInt(plotter.board.width), y: getRandomInt(plotter.board.height)},
        { x: 0, y: 0},
    ];
    const points = new PointCollection(points1)

    await walker.walk(points)
}

run()
