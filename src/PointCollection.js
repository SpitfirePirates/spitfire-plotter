
class PointCollection {
    constructor(points) {
        this.points = points;
    }

    static fromArray(pointArray) {
        const points = pointArray.map(function (point) {
            return {
                x: point[0],
                y: point[1]
            }
        });

        return new PointCollection(points)
    }

    *makeIterator() {
        for (const point of this.points) {
            yield point
        }
    }

    iterate(callback) {
        for (let {x, y} of this.makeIterator()) {
            callback(x,y);
        }
    }

    translate(translateX = 0, translateY = 0) {
        this.points = this.points.map(function (point) {
            return {
                x: point.x + translateX,
                y: point.y + translateY
            }
        })

        return this;
    }

    scale(factor) {
        this.points = this.points.map(function (point) {
            return {
                x: point.x * factor,
                y: point.y * factor
            }
        })

        return this;
    }
}

module.exports = PointCollection
