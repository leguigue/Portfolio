class Sprite {
    constructor({
        position, velocity, image, frames = { max: 1 },sprites}) {
        this.position = position,
            this.image = image,
            this.frames = { ...frames, val: 0, elapsed: 0 },
            this.image.onload = () => {
                this.width = this.image.width / this.frames.max
                this.height = this.image.height
            }
        this.moving = false
        this.sprites=sprites
    }
    draw() {
        ctx.drawImage(
            this.image,
            this.frames.val * this.width,
            0,
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max,
            this.image.height,
        )
        if (!this.moving) return

        if (this.frames.max > 1) {
            this.frames.elapsed++
        }
        if (this.frames.elapsed % 10 === 0) {
            if (this.frames.val < this.frames.max - 1) this.frames.val++
            else this.frames.val = 0
        }
    }
}
class Boundary {
    static width = 36
    static height = 36
    constructor({ position, symbol }) {
        this.position = position
        this.width = 36
        this.height = 36
        this.symbol = symbol
        // Store the initial position
        this.initialPosition = { x: position.x, y: position.y };
    }
    draw() {
        ctx.fillStyle = 'rgba(255,0,0,0.0)'
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}