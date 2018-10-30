const Circle = require('./shapes.js').Circle;

class Engine {
    constructor(options) {
        // List of circles
        this.list = [];
        // List of callbacks
        this.callbacks = [];
        // Milliseconds between each loop
        this.interval = 1;
        // Default number of steps in a circle
        this.steps = 0;
        // Area dimensions
        this.height = (typeof options.height !== 'undefined') ? options.height : 700;
        this.width = (typeof options.width !== 'undefined') ? options.width : 700;
        // Engine paused state
        this.paused = (typeof options.paused !== 'undefined') ? options.paused : false;
    }

    addCircle(circle) {
        if (!(circle instanceof Circle)) {
            throw 'This object is not a circle';
        }
        // Center Root circles
        if (typeof circle.parent === 'undefined') {
            if (!Number.isInteger(circle.x0)) {
                circle.x0 = this.width / 2;
            }
            if (!Number.isInteger(circle.y0)) {
                circle.y0 = this.height / 2;
            }
        }

        this.list.push(circle);
        circle.id = this.list.indexOf(circle);

        return circle.id;
    };

    addCircles(circles) {
        circles.forEach(circle => {
            this.addCircle(circle);
        });

        return this;
    }

    calculateCircle(circle) {
        let arc = circle.getArc();
        let stepCount = circle.getStepCount();
        let distanceTravelled = arc * stepCount;
        let arcToParentRadians = 0;
        let parentRadians = circle.getParentRadians();
        let radiusRelative = 0;
        let parentX0 = circle.x0;
        let parentY0 = circle.y0;

        if (typeof circle.parent !== 'undefined') {
            parentX0 = circle.parent.x0;
            parentY0 = circle.parent.y0;

            arcToParentRadians = (distanceTravelled / circle.parent.radius);
            if (circle.position === 'inside') {
                arcToParentRadians *= -1;
            }

            // The distance from center to center of child and parent
            if (circle.position === 'inside') {
                radiusRelative = circle.parent.radius - circle.radius;
            } else {
                radiusRelative = circle.parent.radius + circle.radius;
            }
        }

        circle.x0 = parentX0 + (Math.cos(parentRadians + arcToParentRadians) * radiusRelative);
        circle.y0 = parentY0 + (Math.sin(parentRadians + arcToParentRadians) * radiusRelative);

        // New x1 & y1 to reflect change in radians
        circle.x1 = circle.x0 + (Math.cos(parentRadians + arcToParentRadians + circle.radians) * circle.radius);
        circle.y1 = circle.y0 + (Math.sin(parentRadians + arcToParentRadians + circle.radians) * circle.radius);
    }

    calculateCircles() {
        this.list.forEach(circle => {
            this.calculateCircle(circle);
        });
    }

    exportCircles(encode = true) {
        let data = JSON.stringify(this.list);
        if (encode === true) {
            return btoa(data);
        }

        return data;
    }

    importCircles(data) {
        let circles = JSON.parse(atob(data));
        let indexedCircles = [];

        circles.forEach(circle => {
            indexedCircles[circle.id] = circle;
        });

        circles.forEach(circle => {
            if (typeof circle.parentId !== 'undefined') {
                circle.parent = indexedCircles[circle.parentId];
            }
        });
        this.addCircles(circles);
    }

    addCallback(callback) {
        this.callbacks.push(callback);
    }

    run() {
        setInterval(() => {
            if (this.paused === false) {
                this.runOnce();
            }
        }, this.interval);
    };

    runOnce() {
        this.list.forEach(circle => {
            this.calculateCircle(circle);
            circle.move();
        });

        this.callbacks.forEach(callback => {
            if (typeof callback === 'function') {
                callback.call(null, this);
            }
        });
    }

    pause() {
        this.paused = true;
    }

    play() {
        this.paused = false;
    }
}

module.exports = Engine;
