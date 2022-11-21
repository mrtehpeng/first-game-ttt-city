
const GameManager = {
    allResources: [], 
    allTiles: [],  
    allUnits: [],
    allTileProps: [],
    renderables: [],
    mouseState: MOUSESTATE.IDLE,
    previousMouseState: MOUSESTATE.IDLE,
    isSelected: undefined, 
    isHolding: undefined,
    isOver: { resource: undefined, unit: undefined, building: undefined },
    processUnitMouseovers: (mouseState, mouse) => {
        switch(mouseState) {
            case MOUSESTATE.DRAG: 
            // if mouse is over unit, add unit to isHolding
            // if exists isHolding, check is unit over any x
            // add x into isOver
                if (!GameManager.isHolding && GameManager.isOver.unit) {
                    GameManager.isHolding = GameManager.isOver.unit 
                } else if (GameManager.isHolding) {
                    const arr = [...GameManager.allResources, ...GameManager.allUnits]
                    GameManager.checkMouseIsOverItem(arr, mouse)
                }
                break 
            case MOUSESTATE.MOVE: { 
                // if mouse is over x, add unit to x
                const arr = [...GameManager.allUnits, ...GameManager.allResources, ...GameManager.allUnits]
                GameManager.checkMouseIsOverItem(arr, mouse)
                break 
            }
        }
    },
    checkMouseIsOverItem: (arr, mouse) => { 
        for (let i = 0; i < arr.length; i++) {
            const item = arr[i]
            if (item != GameManager.isHolding) {
                const isOver = checkCollision(mouse.x, mouse.y, item.position.x, item.position.y, item.width, item.height)
                
                if (isOver) {
                    console.log(" Mouse is over ", item)
                    switch(item.itemType) {
                        case ITEMTYPE.RESOURCE: 
                            GameManager.isOver.resource = item
                            break 
                        case ITEMTYPE.UNIT:
                            GameManager.isOver.unit = item 
                            break 
                    }
                    break
                }
            }
        }
        arr.length = 0
    },
    initPlayer: () => {
        const unitImage = new Image()
        unitImage.src = './farmer-2.png'
        const unit = new Farmer({ position: {x: 0, y: 0} }) 
        let x = randomInt(1, 4)
        let y = randomInt(1, 4)
        let tileNum = ((y-1) * 3) + x 
        let position = calculatePlayerPosition(GameManager.allTiles[tileNum - 1])
        unit.position.x = position.x 
        unit.position.y = position.y 
        GameManager.allUnits.push(unit)
    },
    initTiles: () => {
        const colors = ['blue', 'red', 'green', 'purple', 'orange']
        let xOffset = 0 
        let yOffset = 0 
        let run = 0  
        for (let i=1; i<=3; i++) {
            for (j=1; j<=3; j++) {  
                const bgTile = GameManager.generateTile((run + 1), colors[run % colors.length], xOffset, yOffset)
                const tileProps = { units: [], buildings: [], resources: bgTile.resources }
                GameManager.allTileProps.push(tileProps)
                GameManager.allTiles.push(bgTile)
                xOffset += TILE_SIZE
                run++
            }
            yOffset += TILE_SIZE 
            xOffset=0
        }
    },
    generateTile: (id, color, x, y) => {  
        const randInt = randomInt(0, 10) 
        const tile = new BGTile({ id, color, position: {x, y }, width: TILE_SIZE, height: TILE_SIZE })
        switch(randInt) {
            case 1: 
            case 2: { 
                const rsc = new Resources({ tile, type: RESOURCES.FOREST, position: calculateResourcePosition(tile) })
                tile.resources.push(RESOURCES.FOREST)
                GameManager.allResources.push(rsc)
            }
        }  
        return tile 
    }
}