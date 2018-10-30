const Engine = require('./circio/engine')
const {Circle} = require('./circio/shapes')
const Plotter = require('./src/Plotter')

const plotter = new Plotter();

const engine = new Engine({
    width: plotter.board.width,
    height: plotter.board.height,
    paused: false
});

const A = new Circle({
    radius: 90*8,
    direction: 'ccw',
    radians: 50,
    // steps: 1000
});

const B = new Circle({
    radius: 80*8,
    steps: 1800,
    parent: A,
    position: 'outside',
});

const C = new Circle({
    radius: 20*8,
    steps: 90,
    parent: B,
    position: 'inside',
    direction: 'ccw'
});

engine.addCircles([A,B,C]).calculateCircles();

function* makeCircioIterator() {
    while (true) {
        engine.runOnce();
        const circleLast = engine.list[engine.list.length-1];

        yield {x: circleLast.x1, y: circleLast.y1}
    }
    return
}

async function circio() {
    const circioIterator = makeCircioIterator()

    for (let {x, y} of circioIterator) {
        console.log(x,y)
        await plotter.moveInterpolate(x-plotter.position.x, y-plotter.position.y);
    }
}

circio();
