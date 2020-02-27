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
        this.angle = 0
        this.pixelSize = 10
        this.lineY = 0;
    }

    async drawWiggle(path, width = 3000) {
        this.lineY = this.plotter.position.y
        await this.generateColourMap()
        await this.wiggleGrid()
    }

    async generateColourMap() {
        loadImage(this.photoPath).then((image) => {
            this.ctx.drawImage(image, 0, 0, this.xSteps, this.ySteps)
            // this.ctx.drawImage(this.canvas, 0, 0, this.xSteps, this.ySteps, 0, 0, 200, 200)
            // console.log(this.canvas.toDataURL())
        })
    }

    async wiggleGrid() {
        for (const point of this.wiggleGridIterator()) {
            await this.plotter.move(point.x, point.y)
        }
        console.log('done')
    }

    *wiggleGridIterator() {
        let y = 0
        while (y < this.ySteps) {
            let x = 0
            while (x < this.xSteps) {
                const velocity = this.calculateWiggleVelocityAt(x, y)
                const wigglePoints = this.calculateWigglePoints(velocity)
                for (const point of wigglePoints) {
                    yield point
                }
                x++;
            }
            yield this.nextLinePoint()
            this.lineY += this.pixelSize * 10
            this.angle = 0
            y++;
        }
    }

    calculateWiggleVelocityAt(x, y) {
        const [red, green, blue, alpha] = this.ctx.getImageData(x, y, 1, 1).data;

        return 1 - (((red * 0.299) + (green * 0.587) + (blue * 0.114)) / 255);
    }

    *calculateWigglePoints(velocity) {
        let i = 0
        while (i < this.pixelSize * 2) {
            yield({
                x: 5,
                y: Math.sin(this.angle) * velocity * this.pixelSize * 10
            })
            this.angle += 2
            i++
        }
    }

    nextLinePoint() {
        return {
            x: this.pixelSize * 10 * this.xSteps * -1,
            y: (this.lineY - this.plotter.position.y) + (this.pixelSize * 10)
        }
    }
}

module.exports = Photo
