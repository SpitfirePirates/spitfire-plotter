
class Motor {

    constructor(length) {
        this.length = length
        this.mode = [
            [1,0,0,1],
            [1,0,0,0],
            [1,1,0,0],
            [0,1,0,0],
            [0,1,1,0],
            [0,0,1,0],
            [0,0,1,1],
            [0,0,0,1]
        ]
    }

    setLength(length) {
        const distance = length - this.length
        if (distance > 0) {
            this.reelOut(distance)
        } else {
            this.reelIn(Math.abs(distance))
        }
    }
}

module.exports = Motor
