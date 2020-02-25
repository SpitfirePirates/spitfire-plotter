
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

    async iterate(callback) {
        for (let {x, y} of this.makeIterator()) {
            await callback(x,y);
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

    getBoundingBox() {
        const bounding = this.points.reduce(function (boundingBox, point) {
            return {
                x: Math.min(boundingBox.x, point.x),
                y: Math.min(boundingBox.y, point.y),
                width: Math.max(boundingBox.x, point.x),
                height: Math.max(boundingBox.y, point.y)
            }
        }, {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        })

        if (bounding.x < 0) {
            bounding.width += Math.abs(bounding.x)
        }
        if (bounding.y < 0) {
            bounding.height += Math.abs(bounding.y)
        }

        return bounding
    }
}

module.exports = PointCollection
