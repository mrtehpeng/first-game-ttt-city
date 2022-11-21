
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
    IDLE: 1,
    IS_OVER: 11,
    IS_SELECTED: 12
}

const ITEMTYPE = {
    RESOURCE: 1, 
    UNIT: 2,
    BUILDING: 3 
}

const RESOURCES = {
    MINE: 1, FOREST: 2, LAKE: 3
}