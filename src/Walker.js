class Walker {
    constructor(plotter) {
        this.plotter = plotter
    }

    async walk(pointCollection) {
        return pointCollection.iterate(async (x,y) => {
            await this.plotter.move(x - this.plotter.position.x, y - this.plotter.position.y)
        })
    }

    async walkToCenter() {
        const dx = (this.plotter.board.width / 2) - this.plotter.position.x;
        const dy = (this.plotter.board.height / 2) - this.plotter.position.y;
        await this.plotter.move(dx, dy)
    }
}

module.exports = Walker
