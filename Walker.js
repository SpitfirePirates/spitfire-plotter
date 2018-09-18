const Plotter = require('./Plotter.js')
const plotter = new Plotter()

function* makeWalkIterator(points) {
    for (point of points) {
        yield {
            x: point.x - plotter.position.x,
            y: point.y - plotter.position.y
        }
    }
    return
}

async function walk(pPoints = []) {
    const points = normalisePoints(pPoints)
    const walkIterator = makeWalkIterator(points)
    for (let {dx, dy} of walkIterator) {
        await plotter.move(dx, dy)
    }
}

async function walkToCenter() {
    const dx = (plotter.board.width / 2) - plotter.position.x;
    const dy = (plotter.board.height / 2) - plotter.position.y;
    await plotter.move(dx, dy)
}

function normalisePoints(points = []) {
/*    const extremities = points.reduce(function(carry, point) {
        if (!carry) {
            return point
        }

        return
    });*/
    const factor = 1;
    return = points.map(function(point) {
        return {
            x: point.x * factor,
            y: point.y * factor
        }
    })
}

module.exports = {
    walk: walk,
    walkToCenter: walkToCenter
}
