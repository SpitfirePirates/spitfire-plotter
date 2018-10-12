const Plotter = require('./Plotter')
const plotter = new Plotter()

function* makeSpyroIterator(centerPosition, radius) {
    let angle = 0,
        angle2 = 0

    while(1) {

        let dx = 0;
        let dy = 0;

        while(1) {

            angle += (Math.PI * 2 / 1000)
            angle2 += (Math.PI * 2 / 800)

            let position = adjustByCircle(centerPosition, radius, angle)
            position = adjustByCircle(position, radius / 5, angle2)

            dx = position.x - plotter.position.x;
            dy = position.y - plotter.position.y;

            if (Math.hypot(dx, dy) >= 1) break;
        }

        yield {dx: dx, dy: dy}
    }
    return
}

async function run(radius) {
    const centerPosition = {x: plotter.board.width/2, y: plotter.board.height/2};

    await plotter.moveInterpolate(centerPosition.x, centerPosition.y);

    const walkIterator = makeSpyroIterator(centerPosition, radius)
    for (let {dx, dy} of walkIterator) {
        await plotter.moveInterpolate(dx, dy)
    }
}

function adjustByCircle(center, radius, angle) {
    return {
        x: center.x + (radius * Math.cos(angle)),
        y: center.y + (radius * Math.sin(angle))
    }
}

module.exports = {
    run: run
}
