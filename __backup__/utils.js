
/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function setCursor(cursor) {
    document.body.style.cursor = cursor
}

function calculatePlayerPosition(tile) {
    return { x: tile.position.x + (tile.width/4), y: tile.position.y + (tile.height/2) }
}

function calculateResourcePosition(tile) {
    return { x: tile.position.x, y: tile.position.y }
}

function checkCollision(x1, y1, x2, y2, w, h) {
    return (
        x1 > x2 &&
        x1 < x2 + w &&
        y1 > y2 &&
        y1 < y2 + h
    )  
}

let mouseStateLock = false 
function setMouseState(newState) {  
    console.log(" setMouseState ", newState)
    if (!mouseStateLock) { 
        mouseStateLock = true 
        //console.log(` # setmousestate ${GameManager.mouseState} -> ${newState} `)
        GameManager.previousMouseState = GameManager.mouseState
        GameManager.mouseState = newState
        mouseStateLock = false 
    }
}
