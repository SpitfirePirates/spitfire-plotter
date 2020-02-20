const InvalidGraphCallbackException = require('./Exceptions/InvalidGraphCallbackException')

class Graph {
    constructor(plotter, max = 1000, callback = null) {
        this.plotter = plotter
        this.width = 2000
        this.height = 2000
        this.tailLength = 100
        this.steps = {
            current: 0,
            total: 20,
            duration: 5
        }
        this.value = {
            current: 0,
            max: max
        }
        this.callback = callback
    }

    async start() {
        if (this.callback === null) {
            throw new InvalidGraphCallbackException();
        }
        await this.reposition()
        await this.drawAxes()
        while (this.steps.current < this.steps.total) {
            await this.processStep()
            await this.delay(this.steps.duration)
        }
    }

    async reposition() {
        if (this.plotter.position.x < this.tailLength) {
            await this.plotter.move(this.tailLength, 0)
        }
        if (this.plotter.position.y < this.tailLength) {
            await this.plotter.move(0, this.tailLength)
        }
    }

    async drawAxes() {
        await this.plotter.move(0, this.height + this.tailLength)
        await this.plotter.move(0, this.tailLength * -1)
        await this.plotter.move(this.tailLength * -1, 0)
        await this.plotter.move(this.width + this.tailLength, 0)
        await this.plotter.move((this.width) * -1, 0)
    }

    async processStep() {
        const value = await this.callback.call()
        const scaleFactor = this.height / this.value.max
        await this.plotter.move(this.width / this.steps.total, (value - this.value.current) * scaleFactor * -1)

        this.value.current = value
        this.steps.current++
    }

    delay(amount) {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, amount * 1000)
        })
    }
}

module.exports = Graph
