const canvas = document.getElementById('portfolio')
const ctx = canvas.getContext('2d')
canvas.width = 1024;
canvas.height = 576;
let currentMap = 'outside';
let transitioning = false;
let fadeAlpha = 0;
const collisionsMap = [];
const collisionsContact=[];
for (let i = 0; i < collisionsMapPrincipale.length; i += 80) {
    collisionsMap.push(collisionsMapPrincipale.slice(i, 80 + i))
}

const boundaries = []
const offset = {
    x: -935,
    y: -250
}
collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025)
            boundaries.push(new Boundary({
                position: {
                    x: j * Boundary.width + offset.x,
                    y: i * Boundary.height + offset.y
                }
            })
            )
    })
})
const image = new Image()
image.src = './assets/images/supermap2.png'
const foregroundimage = new Image()
foregroundimage.src = './assets/images/traversable.png'
const playerDownImage = new Image()
playerDownImage.src = './assets/images/playerDown.png'
const playerUpImage = new Image()
playerUpImage.src = './assets/images/playerUp.png'
const playerLeftImage = new Image()
playerLeftImage.src = './assets/images/playerLeft.png'
const playerRightImage = new Image()
playerRightImage.src = './assets/images/playerRight.png'

const player = new Sprite({
    position: {
        x: canvas.width / 2 - 192 / 4 / 2,
        y: canvas.height / 2 - 68 / 2,
    },
    image: playerDownImage,
    frames: {
        max: 4
    },
    sprites:{
        up:playerUpImage,
        left:playerLeftImage,
        right:playerRightImage,
        down:playerDownImage
    }
})
const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: image
})
const foreground = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: foregroundimage
})
const keys = {
    z: {
        pressed: false
    },
    q: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    },
}
const movibles = [background, ...boundaries,foreground]
function rectangularcollision({ rectangle1, rectangle2 }) {
    return (rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y)
}
function movement() {
    if (transitioning) {
        fadeAlpha += 0.05;
        if (fadeAlpha >= 1) {
            switchMap();
        }
        drawFade();
        return;
    }
    background.draw()
    boundaries.forEach((boundary) => {
        boundary.draw()
    })
    player.draw()
    foreground.draw()
    let moving = true
    player.moving=false
    if (keys.z.pressed && lastKey === 'z') {
        player.moving=true
        player.image=player.sprites.up
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (rectangularcollision({
                rectangle1: player,
                rectangle2: {
                    ...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y + 6
                    }
                }
            })
            ) {
                moving = false
                break
            }
        }
        if (moving)
            movibles.forEach((movible) => {
                movible.position.y += 6
            })
    }
    else if (keys.q.pressed && lastKey === 'q') {
        player.moving=true
        player.image=player.sprites.left
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (rectangularcollision({
                rectangle1: player,
                rectangle2: {
                    ...boundary, position: {
                        x: boundary.position.x+ 6,
                        y: boundary.position.y 
                    }
                }
            })
            ) {
                moving = false
                break
            }
        }
        if (moving)
            movibles.forEach((movible) => {
                movible.position.x += 6
            })
    }
    else if (keys.s.pressed && lastKey === 's') {
        player.moving=true
        player.image=player.sprites.down
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (rectangularcollision({
                rectangle1: player,
                rectangle2: {
                    ...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y - 6
                    }
                }
            })
            ) {
                moving = false
                break
            }
        }
        if (moving)
            movibles.forEach((movible) => {
                movible.position.y -= 6
            })
    }
    else if (keys.d.pressed && lastKey === 'd') {
        player.moving=true
        player.image=player.sprites.right
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (rectangularcollision({
                rectangle1: player,
                rectangle2: {
                    ...boundary, position: {
                        x: boundary.position.x-6,
                        y: boundary.position.y
                    }
                }
            })
            ) {
                moving = false
                break
            }
        }
        if (moving)
            movibles.forEach((movible) => {
                movible.position.x -= 6
            })
            if (currentMap === 'outside') {
                const houseEntrance = boundaries.find(b => b.symbol === 1029);
                if (houseEntrance && rectangularcollision({
                    rectangle1: player,
                    rectangle2: houseEntrance
                })) {
                    transitioning = true;
                }
            }
    }
    requestAnimationFrame(movement);
}
movement()
let lastKey = ''
window.addEventListener(`keydown`, (e) => {
    switch (e.key) {
        case 'z':
            keys.z.pressed = true
            lastKey = 'z'
            break
        case 'q':
            keys.q.pressed = true
            lastKey = 'q'
            break
        case 's':
            keys.s.pressed = true
            lastKey = 's'
            break
        case 'd':
            keys.d.pressed = true
            lastKey = 'd'
            break
    }

})

window.addEventListener(`keyup`, (e) => {
    switch (e.key) {
        case 'z':
            keys.z.pressed = false
            break
        case 'q':
            keys.q.pressed = false
            break
        case 's':
            keys.s.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
    }

})
function drawFade() {
    ctx.fillStyle = `rgba(0, 0, 0, ${fadeAlpha})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

