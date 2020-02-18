class Walker {
    constructor(plotter) {
        this.plotter = plotter
    }
    * makeWalkIterator(points) {
        for (const point of points) {
            yield {
                dx: point.x - this.plotter.position.x,
                dy: point.y - this.plotter.position.y
            }
        }
        return
    }

    async walk(pPoints = []) {
        const points = this.normalisePoints(pPoints)
        const walkIterator = this.makeWalkIterator(points)
        for (let {dx, dy} of walkIterator) {
            await this.plotter.move(dx, dy)
        }
    }

    async walkToCenter() {
        const dx = (this.plotter.board.width / 2) - this.plotter.position.x;
        const dy = (this.plotter.board.height / 2) - this.plotter.position.y;
        await this.plotter.move(dx, dy)
    }

    normalisePoints(points = []) {
        /*    const extremities = points.reduce(function(carry, point) {
                if (!carry) {
                    return point
                }

                return
            });*/
        const factor = 1;
        return points.map(function (point) {
            return {
                x: point.x * factor,
                y: point.y * factor
            }
        })
    }

    translatePoints(points, translateX = 0, translateY = 0) {
        return points.map(function (point) {
            return {
                x: point.x + translateX,
                y: point.y + translateY
            }
        })
    }

    scalePoints(points, factor) {
        return points.map(function (point) {
            return {
                x: point.x * factor,
                y: point.y * factor
            }
        })
    }

    arrayToObjects(points) {
        return points.map(function (point) {
            return {
                x: point[0],
                y: point[1]
            }
        });
    }
}

module.exports = Walker
