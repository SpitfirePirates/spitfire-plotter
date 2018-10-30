class Shape {
    constructor(options) {}

    setParent (parent) {
        if(!(parent instanceof Shape)) {
            throw 'This parent is not a shape';
        }

        this.parent = parent;
    }
}

class Circle extends Shape {
    constructor (options) {
        super(options);

        if(isNaN(options.radius)) {
            throw 'A circle needs a radius';
        }

        if(typeof options.parent !== 'undefined') {
            this.setParent(options.parent);
        }

        this.settings = {
            radius : options.radius,
            x0 : (typeof options.x0 !== 'undefined') ? options.x0 : false,
            y0 : (typeof options.y0 !== 'undefined') ? options.y0 : false,
            parentId : (typeof options.parent !== 'undefined') ? options.parent.id: false,
            direction : (typeof options.direction !== 'undefined') ? options.direction: 'cw',
            position : (typeof options.position !== 'undefined') ? options.position: 'inside',
            steps : (typeof options.steps !== 'undefined') ? options.steps: 0,
            radians : (typeof options.radians !== 'undefined') ? options.radians: 0,
            fixed : (typeof options.fixed !== 'undefined') ? options.fixed: true,
        };
        Object.assign(this, JSON.parse(JSON.stringify(this.settings)));
    }

    getStepRadians () {
        let stepRadian = 0;
        if(this.steps > 0) {
            stepRadian = (360/this.steps) * (Math.PI/180);
        }

        return stepRadian;
    }

    getArc () {
        let arc = 0;
        if(this.steps > 0) {
            arc = this.radius * this.getStepRadians();
        }

        return arc;
    }

    getStepCount () {
        let stepCount = 0;
        if(this.steps > 0) {
            stepCount = this.radians / this.getStepRadians();
        }

        return stepCount;
    }

    getRadians () {
        return Math.atan2(
            (this.y1 - this.y0), // Delta Y
            (this.x1 - this.x0) // Delta X
        );
    }

    getParentRadians () {
        if(typeof this.parent === 'undefined' || this.fixed === false) {
            return 0;
        }

        return this.parent.getRadians();
    }

    move () {
        let stepRadian = this.getStepRadians();

        if(this.direction === 'cw') {
            this.radians += stepRadian;
        } else {
            this.radians -= stepRadian;
        }
    }
}

module.exports = {
    Circle:Circle
};
