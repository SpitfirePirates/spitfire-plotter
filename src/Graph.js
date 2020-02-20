class Graph {
    constructor(plotter, size = 1000) {
        this.plotter = plotter
        this.width = size
        this.height = size
        this.tailLength = 100
        this.steps = {
            current: 0,
            total: 20,
            duration: 5
        }
        this.value = {
            current: 0,
            max: 100
        }
    }

    async start() {
        await this.reposition()
        await this.drawAxes()
        while (this.steps.current < this.steps.total) {
            await this.processStep()
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
        const value = this.steps.current * this.steps.current
        const scaleFactor = this.height / this.value.max
        await this.plotter.move(this.width / this.steps.total, (value - this.value.current) * scaleFactor * -1)

        this.value.current = value
        this.steps.current++
    }
}

module.exports = Graph
