class Graph {
    constructor(plotter, size = 1000) {
        this.plotter = plotter
        this.width = size
        this.height = size
        this.tailLength = 100
    }

    async start() {
        await this.reposition()
        await this.drawAxes()
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
}

module.exports = Graph
