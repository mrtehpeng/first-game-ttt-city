
const GM = {
    mouse: { x: undefined, y: undefined, hold: false }
}

BUTTON_SHADOW = 'BUTTON_SHADOW'
CANVAS_WIDTH = 800
CANVAS_HEIGHT = 600
TILE_SIZE = 168

SPRITETYPE = {
    TILE: 'TILE',
    RESOURCE: 'RESOURCE',
    UNIT: 'UNIT'
}
/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
const Utils = { 
    randomInt: (min, max) => {
        return Math.floor(Math.random() * (max - min) + min);
    },
    setCursor: (cursor) => {
        document.body.style.cursor = cursor
    },
    checkCollision: (x1, y1, x2, y2, w, h) => {
        return (
            x1 > x2 &&
            x1 < x2 + w &&
            y1 > y2 &&
            y1 < y2 + h
        )  
    }
}