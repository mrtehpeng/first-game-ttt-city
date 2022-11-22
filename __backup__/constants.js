
const BUILDING_WIDTH = 84
const BUILDING_HEIGHT = 84
const UNIT_SIZE = 84 
const RESOURCE_SIZE = 84
const TILE_SIZE = 168

const MOUSESTATE = {
    IDLE: 'IDLE',
    MOVE: 'MOVE',
    DOWN: 'DOWN',
    DRAG: 'DRAG',
    UP: 'UP',
    CLICK: 'CLICK'
}

const SPRITESTATE = {
    IDLE: 'IDLE',
    IS_OVER: 'IS_OVER',
    IS_SELECTED: 'IS_SELECTED'
}

const ITEMTYPE = {
    TILE: "TILE",
    RESOURCE: 'RESOURCE', 
    UNIT: 'UNIT',
    BUILDING: 'BUILDING' 
}

const RESOURCES = {
    MINE: 1, FOREST: 2, LAKE: 3
}