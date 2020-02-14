function* makeWalkIterator(plotter, points) {
    for (point of points) {
        yield {
            dx: point.x - plotter.position.x,
            dy: point.y - plotter.position.y
        }
    }
    return
}

async function walk(plotter, pPoints = []) {
    const points = normalisePoints(pPoints)
    const walkIterator = makeWalkIterator(plotter, points)
    for (let {dx, dy} of walkIterator) {
        await plotter.move(dx, dy)
    }
}

async function walkToCenter(plotter) {
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
    return points.map(function(point) {
        return {
            x: point.x * factor,
            y: point.y * factor
        }
    })
}

function translatePoints(points, translateX = 0, translateY = 0) {
    return points.map(function (point) {
        return {
            x: point.x + translateX,
            y: point.y + translateY
        }
    })
}

function scalePoints(points, factor) {
    return points.map(function (point) {
        return {
            x: point.x * factor,
            y: point.y * factor
        }
    })
}

function arrayToObjects(points) {
    return points.map(function (point) {
        return {
            x: point[0],
            y: point[1]
        }
    });
}

module.exports = {
    walk: walk,
    walkToCenter: walkToCenter,
    normalisePoints: normalisePoints,
    translatePoints: translatePoints,
    arrayToObjects: arrayToObjects,
    scalePoints: scalePoints,
}
