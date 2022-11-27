
const GM = {
    mouse: { x: undefined, y: undefined, hold: false },
    generateTiles: () => {
        let run=1
        let colors = ['blue', 'red', 'orange', 'purple']
        tiles.length = 0
        for (let y=0; y<3; y++) {
            for (let x=0; x<3; x++) {
                const color = colors[run % colors.length]
                const tile = new Tile({ tileType: TILETYPE.GRASS, position: { x: x * TILE_SIZE, y: y * TILE_SIZE }, width: TILE_SIZE, height: TILE_SIZE })
                tiles.push({ index: run, x: tile.position.x, y: tile.position.y, cards: [] })
                renderables.push(tile)
                run++
            }
        }
    }
}

BUTTON_SHADOW = 'BUTTON_SHADOW'
CANVAS_WIDTH = 800
CANVAS_HEIGHT = 600
TILE_SIZE = 168

SPRITETYPE = {
    TILE: 'TILE',
    RESOURCE: 'RESOURCE',
    UNIT: 'UNIT',
    BUTTON: 'BUTTON',
    BUTTONSHADOW: 'BUTTONSHADOW',
    CARD: 'CARD',
    CARDBUTTON: 'CARDBUTTON'
}

TILETYPE = {
    GRASS: 'grass'
}

UNITSTATS = {
    'card': {
        attk: 2, def: 2, hp: 2
    }, 
    'gold-card': {
        attk: 4, def: 3, hp: 5
    }
}


/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
const Utils = { 
    // Add offset mouse position to current scroll position
    getExactPosition: (position) => {
        const oY = window.scrollY //|| document.documentElement.scrollTop
        const oX = window.scrollX // || document.documentElement.scrollLeft
        return { x: position.x + oX, y: position.y + oY }
    },
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
    },
    /**
     * 
     * @param {*} x 
     * @param {*} y 
     * @returns tileIndex 0 ~ 8
     */
    checkOverTile: (x, y) => {
        let tileIndex = -1
        tiles.forEach((tile) => {
            const yes = Utils.checkCollision(x, y, tile.x, tile.y, TILE_SIZE, TILE_SIZE) 
            if (yes) {
                tileIndex = tile.index  
            }
        })
        if (tileIndex == -1) return tileIndex
        return tileIndex -1
    },
    randStr(len) {
        const abc = "abcdefghijklmnopqrstuvwxyz"
        const nums = "0123456789"
        const all = abc + (abc.toUpperCase()) + nums 
        let str=""
        for (let i=0; i<len; i++) {
            str += all[Utils.randomInt(0, all.length)]
        }
        return str
    }
}