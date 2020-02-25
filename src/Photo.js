const fs = require('fs').promises
const { createCanvas, loadImage } = require('canvas')

class Photo {
    constructor(plotter, photoPath) {
        this.plotter = plotter
        this.photoPath = photoPath
        this.canvas = createCanvas(200, 200)
        this.ctx = this.canvas.getContext('2d')
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.globalCompositeOperation = 'luminosity'
        this.xSteps = 40
        this.ySteps = 40
    }

    async drawWiggle(path, width = 3000) {
        await this.generateColourMap()
        await this.wiggleGrid()
    }

    async generateColourMap() {
        loadImage(this.photoPath).then((image) => {
            this.ctx.drawImage(image, 0, 0, this.xSteps, this.ySteps)
            // this.ctx.drawImage(this.canvas, 0, 0, 20, 20, 0, 0, 200, 200)
            // console.log(this.canvas.toDataURL())
        })
    }

    async wiggleGrid() {
        for (const point of this.calculateWigglePoints(1)) {
            await this.plotter.move(point.x, point.y)
        }
    }

    *wiggleGridIterator() {
        let y = 0
        while (y < this.ySteps) {
            let x = 0
            while (x < this.xSteps) {
                const velocity = this.calculateWiggleVelocityAt(x, y)
                const wigglePoints = this.calculateWigglePoints(velocity)
                x++;
            }
            y++;
        }
    }

    calculateWiggleVelocityAt(x, y) {
        const [red, green, blue, alpha] = this.ctx.getImageData(x, y, 1, 1).data;

        return ((red * 0.299) + (green * 0.587) + (blue * 0.114)) / 255;
    }

    calculateWigglePoints(velocity) {
        
    }
}

module.exports = Photo
