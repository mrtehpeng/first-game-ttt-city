class Resources {
    constructor(params) {
        const { tile, type, position } = params
        this.itemType = ITEMTYPE.RESOURCE
        this.tile = tile  
        this.type = type 
        this.position = position
        this.width = RESOURCE_SIZE
        this.height = RESOURCE_SIZE
        this.mouseIsOver = false 
        this.workedBy = undefined // object if Unit that is working.
        this.setImageSrc()
    }

    setImageSrc() { 
        switch(this.type) {
            case RESOURCES.FOREST:
                this.image = new Image()
                this.image.src = `./forest.png`
                break 
            case RESOURCES.MINE: 
                this.image = new Image()
                this.image.src = `./mine.png`
                break 
            case RESOURCES.LAKE: 
                this.image = new Image()
                this.image.src = `./water.png`
                break 
        } 
    }

    draw() {
        const img = new Image() 
        img.src = this.image.src
        c.drawImage(img, 0, 0, img.width, img.height, this.position.x, this.position.y, this.width, this.height)
    } 

    update(mouse) {
        const isOver = checkCollision(
            mouse.x, mouse.y, this.position.x, this.position.y, UNIT_SIZE, UNIT_SIZE 
        )  
        this.mouseIsOver = isOver 
        setCursor(isOver ? 'grab' : 'default')
        this.setImageSrc()
        this.draw()
    }
}

class Unit {
    constructor(params) {
        const { width, height, position } = params 
        this.itemType = ITEMTYPE.UNIT 
        this.width = UNIT_SIZE
        this.height = UNIT_SIZE
        this.position = position
        this.state = SPRITESTATE.IDLE
    }

    updatePosition(position) {
        this.position.x = position.x - (this.width/2)
        this.position.y = position.y - (this.height/2) 
    }
}

class Farmer extends Unit {
    constructor(params) {
        super(params)
        const { selected = false } = params 
        this.mouseIsOver = selected 
        this.setImageSrc()
    }

    draw() { 
        const img = this.image
        c.drawImage(img, 0, 0, img.width, img.height, this.position.x, this.position.y, this.width, this.height)
    } 

    setImageSrc() {
        const imageSrc = `./farmer-2${this.state == SPRITESTATE.IS_OVER || this.state == SPRITESTATE.IS_SELECTED ? '-selected' : ''}.png` 
        this.image = new Image()
        this.image.src = imageSrc 
    }

    update(mouse) {

        const isOver = checkCollision(
            mouse.x, mouse.y, this.position.x, this.position.y, this.width, this.height 
        )
        // If farmer was already IS_SELECTED, it means the user just released the mouse button
        // ie 'released' the farmer.
        // Check GameManager.isOver.resource, if it has something,
        // put farmer into that particular resource. 
        this.state = isOver ? (mouse.holding ? SPRITESTATE.IS_SELECTED : SPRITESTATE.IS_OVER) : SPRITESTATE.IDLE 
        setCursor(isOver ? 'grab' : 'default')
        console.log(" User state " + this.state )
        if (this.state == SPRITESTATE.IS_SELECTED) { 
            super.updatePosition({ x: mouse.x, y: mouse.y })
        }

        // Check if farmer is over resources
        // if (this.state == SPRITESTATE.IS_SELECTED) { 
        //     super.updatePosition({ x: mouse.x, y: mouse.y })
        //     let isOver = false 
        //     for (let i = 0; i < GameManager.allResources.length; i++) { 
        //         const resource = GameManager.allResources[i]
        //         isOver = checkCollision(
        //             mouse.x, mouse.y, resource.position.x, resource.position.y, RESOURCE_SIZE, RESOURCE_SIZE 
        //         )
        //         if (isOver) {
        //             console.log(" Farmer is over resource ", resource)
        //             GameManager.isOver.resource = resource
        //             break 
        //         }  
        //     }
        //     if (isOver) {
        //         GameManager.isOver.resource = undefined 
        //     }
        // }
        this.setImageSrc()
        this.draw()
    }
}