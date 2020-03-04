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
        this.xPixels = 120
        this.yPixels = 40
        this.angle = 0
        this.pixelSize = 5
        this.lineY = 0;
        this.startPosition
        this.useColour = false
        this.colour = 0
    }

    async drawWiggle() {
        this.startPosition = Object.assign({}, this.plotter.position)
        await this.generateColourMap()
        await this.wiggleGrid()
    }

    async generateColourMap() {
        loadImage(this.photoPath).then((image) => {
            this.ctx.drawImage(image, 0, 0, this.xPixels, this.yPixels)
        })
    }

    async wiggleGrid() {
        for (const point of this.wiggleGridIterator()) {
            await this.plotter.move(point.x - this.plotter.position.x, point.y - this.plotter.position.y)
        }
        console.log('done')
    }

    *wiggleGridIterator() {
        this.colour = 0
        const colours = this.useColour ? 3 : 1
        while (this.colour < colours) {
            if (this.useColour) {
                this.setColour()
            }
            let y = 0
            let direction = 1
            this.lineY = this.startPosition.y
            while (y < this.yPixels) {
                let x = 0
                while (x < this.xPixels) {
                    const pixelX = direction === 1 ? x : this.xPixels - x - 1;
                    const velocity = this.calculateWiggleVelocityAt(pixelX, y)
                    const wigglePoints = this.calculateWigglePoints(velocity, direction)
                    for (const point of wigglePoints) {
                        yield point
                    }
                    x++;
                }
                yield this.nextLinePoint()
                this.lineY += this.pixelSize * 10
                this.angle = 0
                direction *= -1
                y++;
            }
            yield this.startPosition
            this.colour++
        }
    }

    calculateWiggleVelocityAt(x, y) {
        const [red, green, blue, alpha] = this.ctx.getImageData(x, y, 1, 1).data;

        if (this.useColour === false) {
            return 1 - (((red * 0.299) + (green * 0.587) + (blue * 0.114)) / 255);
        }
        if (this.colour === 0) {
            return 1 - (red / 255);
        }
        if (this.colour === 1) {
            return 1 - (green / 255);
        }
        if (this.colour === 2) {
            return 1 - (blue / 255);
        }
    }

    *calculateWigglePoints(velocity, direction) {
        let i = 0
        while (i < this.pixelSize * 2) {
            yield({
                x: this.plotter.position.x + (5 * direction),
                y: this.lineY + (Math.sin(this.angle) * this.pixelSize * 5)
            })
            this.angle += velocity
            i++
        }
    }

    nextLinePoint() {
        return {
            x: this.plotter.position.x,
            y: this.lineY + (this.pixelSize * 10)
        }
    }

    setColour() {
        if (this.colour === 0) {
            this.plotter.setColour('red')
        }
        if (this.colour === 1) {
            this.plotter.setColour('green')
        }
        if (this.colour === 2) {
            this.plotter.setColour('blue')
        }
    }
}

module.exports = Photo
