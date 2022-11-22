class Sprite {
    constructor(params) {
        const { color, position, width, height, } = params 
        this.position = position 
        this.width = width 
        this.height = height 
        console.log("Sprite Params ", params) 
        this.color = color 
    }

    update() {
        this.draw()
    }

    draw() {
        c.fillStyle = this.color 
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    isOverlapping(spriteKey) {
        const item = GameManager.renderables.filter((item) => item.key == spriteKey )
        return checkCollision(GameManager.mouse.x, GameManager.mouse.y, item.position.x, item.position.y, item.width, item.height)
    }
}


class BGTile extends Sprite {
    constructor(params) {
        super(params) 
        const { id, buildings = [], resources = [] } = params 
        this.itemType = ITEMTYPE.TILE
        this.id = id 
        this.buildings = buildings  
        this.resources = resources
        console.log(" BG Tile Resources ", resources)
    }

    update(mouse) { 
        this.draw()

    }

    draw() {
        super.draw()    
        c.fillStyle = 'blue'
        this.buildings.forEach(building => {
            c.fillRect(this.position.x + (this.width/2), this.position.y, BUILDING_WIDTH, BUILDING_HEIGHT)
        }); 
    }
}