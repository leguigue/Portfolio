const canvas = document.getElementById('portfolio');
const ctx = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;

let currentMap = 'outside';
let transitioning = false;
let fadeAlpha = 0;
let transitionCooldown = 0;

// Collision maps
const collisionsMap = [];
const collisionsContact = [];
const boundaries = [];
const contactZones = [];
const transitionTiles = [];
const interiorBoundaries = [];
const interiorTransitionTiles = [];

const mapOffset = {
    x: -935,
    y: -250
};

const contactOffset = {
    x: 412,
    y: 612
};

// Process collision maps
for (let i = 0; i < collisionsMapPrincipale.length; i += 80) {
    collisionsMap.push(collisionsMapPrincipale.slice(i, 80 + i));
}

for (let i = 0; i < collisionsContactZone.length; i += 80) {
    collisionsContact.push(collisionsContactZone.slice(i, 80 + i));
}

// Create boundaries and transition tiles for main map
collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025) {
            boundaries.push(new Boundary({
                position: {
                    x: j * Boundary.width + mapOffset.x,
                    y: i * Boundary.height + mapOffset.y
                },
                symbol: symbol
            }));
        } else if (symbol === 1029) {
            transitionTiles.push(new Boundary({
                position: {
                    x: j * Boundary.width + mapOffset.x,
                    y: i * Boundary.height + mapOffset.y
                },
                symbol: symbol
            }));
        }
    });
});

// Create boundaries and transition tiles for interior map
collisionsContact.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025) {
            interiorBoundaries.push(new Boundary({
                position: {
                    x: j * Boundary.width + contactOffset.x,
                    y: i * Boundary.height + contactOffset.y
                },
                symbol: symbol
            }));
        } else if (symbol === 1029) {
            interiorTransitionTiles.push(new Boundary({
                position: {
                    x: j * Boundary.width + contactOffset.x,
                    y: i * Boundary.height + contactOffset.y
                },
                symbol: symbol
            }));
        }
    });
});

// Load images
const image = new Image();
image.src = './assets/images/supermap2.png';

const foregroundimage = new Image();
foregroundimage.src = './assets/images/traversable.png';

const playerDownImage = new Image();
playerDownImage.src = './assets/images/playerDown.png';

const playerUpImage = new Image();
playerUpImage.src = './assets/images/playerUp.png';

const playerLeftImage = new Image();
playerLeftImage.src = './assets/images/playerLeft.png';

const playerRightImage = new Image();
playerRightImage.src = './assets/images/playerRight.png';

const interiorImage = new Image();
interiorImage.src = './assets/images/interieurmaison.png';

const interiorForegroundImage = new Image();
interiorForegroundImage.src = './assets/images/traversableinterieur.png';

// Create sprites
const player = new Sprite({
    position: {
        x: canvas.width / 2 - 192 / 4 / 2,
        y: canvas.height / 2 - 68 / 2,
    },
    image: playerDownImage,
    frames: {
        max: 4
    },
    sprites: {
        up: playerUpImage,
        left: playerLeftImage,
        right: playerRightImage,
        down: playerDownImage
    }
});

const background = new Sprite({
    position: {
        x: mapOffset.x,
        y: mapOffset.y
    },
    image: image
});

const foreground = new Sprite({
    position: {
        x: mapOffset.x,
        y: mapOffset.y
    },
    image: foregroundimage
});

const interiorBackground = new Sprite({
    position: {
        x: contactOffset.x,
        y: contactOffset.y
    },
    image: interiorImage
});

const interiorForeground = new Sprite({
    position: {
        x: contactOffset.x,
        y: contactOffset.y
    },
    image: interiorForegroundImage
});

// Keys for movement
const keys = {
    z: { pressed: false },
    q: { pressed: false },
    s: { pressed: false },
    d: { pressed: false },
};

let movibles = [background, ...boundaries, ...transitionTiles, foreground];
let lastKey = '';

function rectangularcollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y
    );
}

function switchMap() {
    if (currentMap === 'outside') {
        currentMap = 'inside';
        player.position.x = 408;
        player.position.y = 600 - player.height - 5;
        movibles = [interiorBackground, ...interiorBoundaries, ...interiorTransitionTiles, interiorForeground];
    } else {
        currentMap = 'outside';
        player.position.x = 500;
        player.position.y = 500;
        movibles = [background, ...boundaries, ...transitionTiles, foreground];
    }
}

function handlePlayerMovement() {
    let moving = true;
    player.moving = false;

    const currentBoundaries = currentMap === 'outside' ? boundaries : interiorBoundaries;
    const currentTransitionTiles = currentMap === 'outside' ? transitionTiles : interiorTransitionTiles;

    if (keys.z.pressed && lastKey === 'z') {
        player.moving = true;
        player.image = player.sprites.up;
        checkCollisionAndMove(currentBoundaries, 0, -6);
    } else if (keys.q.pressed && lastKey === 'q') {
        player.moving = true;
        player.image = player.sprites.left;
        checkCollisionAndMove(currentBoundaries, -6, 0);
    } else if (keys.s.pressed && lastKey === 's') {
        player.moving = true;
        player.image = player.sprites.down;
        checkCollisionAndMove(currentBoundaries, 0, 6);
    } else if (keys.d.pressed && lastKey === 'd') {
        player.moving = true;
        player.image = player.sprites.right;
        checkCollisionAndMove(currentBoundaries, 6, 0);
    }

    // Check for transition after movement
    if (!transitioning && transitionCooldown <= 0) {
        for (const tile of currentTransitionTiles) {
            if (rectangularcollision({
                rectangle1: player,
                rectangle2: tile
            })) {
                console.log("Transition triggered!");
                transitioning = true;
                switchMap();
                fadeAlpha = 0;
                break;
            }
        }
    }

    if (transitionCooldown > 0) transitionCooldown--;
}

function checkCollisionAndMove(boundaries, dx, dy) {
    for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i];
        if (rectangularcollision({
            rectangle1: player,
            rectangle2: {
                ...boundary, position: {
                    x: boundary.position.x - dx,
                    y: boundary.position.y - dy
                }
            }
        })) {
            return;
        }
    }
    movibles.forEach((movible) => {
        movible.position.x -= dx;
        movible.position.y -= dy;
    });
}

function handleTransition() {
    if (fadeAlpha < 1) {
        fadeAlpha += 0.05;
        if (fadeAlpha >= 1) {
            switchMap();
        }
    } else {
        fadeAlpha -= 0.05;
        if (fadeAlpha <= 0) {
            transitioning = false;
            transitionCooldown = 30;
            fadeAlpha = 0;
        }
    }
}

function drawFade() {
    ctx.fillStyle = `rgba(0, 0, 0, ${fadeAlpha})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function movement() {
    window.requestAnimationFrame(movement);
    if (transitioning) {
        handleTransition();
    } else {
        if (currentMap === 'outside') {
            background.draw();
            boundaries.forEach((boundary) => {
                boundary.draw();
            });
            transitionTiles.forEach((tile) => {
                tile.draw();
            });
            player.draw();
            foreground.draw();
        } else {
            interiorBackground.draw();
            interiorBoundaries.forEach((boundary) => {
                boundary.draw();
            });
            interiorTransitionTiles.forEach((tile) => {
                tile.draw();
            });
            player.draw();
            interiorForeground.draw();
        }
        handlePlayerMovement();
    }
    drawFade();
}

// Event listeners
window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'z':
            keys.z.pressed = true;
            lastKey = 'z';
            break;
        case 'q':
            keys.q.pressed = true;
            lastKey = 'q';
            break;
        case 's':
            keys.s.pressed = true;
            lastKey = 's';
            break;
        case 'd':
            keys.d.pressed = true;
            lastKey = 'd';
            break;
    }
});

window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'z':
            keys.z.pressed = false;
            break;
        case 'q':
            keys.q.pressed = false;
            break;
        case 's':
            keys.s.pressed = false;
            break;
        case 'd':
            keys.d.pressed = false;
            break;
    }
});

// Start the game loop
movement();