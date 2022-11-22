const canvas = document.querySelector('canvas')

canvas.width = CANVAS_WIDTH
canvas.height = CANVAS_HEIGHT
const c = canvas.getContext('2d')
c.fillStyle = '#333'
c.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
let colors = ['blue', 'red', 'orange', 'purple']
let run = 1

class Sprite {
    constructor(params) {
        const { position={x: 0, y: 0}, width=0, height=0, color = '', image=undefined, crop={x: 0, y: 0}, frames = {max: 1} } = params 
        this.position = position
        this.width = width 
        this.height = height 
        this.color = color 
        this.image = image
        this.frames = {
            max: frames.max
        } 
        this.crop = crop 
    }

    draw() {
        if (this.image) { 
            const img = new Image()
            img.src = this.image
            const crop = {
                x: this.crop.x, y: this.crop.y,
                width: img.width / this.frames.max, 
                height: img.height 
            }
            c.drawImage(img, crop.x, crop.y, crop.width, crop.height, this.position.x, this.position.y, img.width, img.height) 
        } else { 
            if (this.color != '') c.fillStyle = this.color 
            c.fillRect(this.position.x, this.position.y, this.width, this.height)
        }
    }

    update() {
        this.draw()
    }
}

class Tile extends Sprite {
    constructor(params) {
        super(params)
        this.spriteType = SPRITETYPE.TILE
    }

    draw() {
        super.draw()
    }

    update() {
        this.draw()
    }
}

class Button {
    constructor(params) {  
        const { position = {x: 0, y: 0} } = params
        this.selected = false 
        this.held = false 
        this.position = position
        this.width = 65 
        this.height = 80
        this.setImage() 
    } 
    setImage() { 
        const farmer = `./farmer-2${this.selected || this.held ? '-selected' : ''}.png`
        this.image = new Image()
        this.image.src = farmer 
    }

    draw() {  
        c.drawImage(this.image, 0, 0, this.width, this.height, this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        const mouse = GM.mouse 
        this.selected = Utils.checkCollision(mouse.x, mouse.y, this.position.x, this.position.y, this.width, this.height)
        if (this.selected) this.held = mouse.hold  
        
        if (this.held) { 
            if (renderables.findIndex((item) => item.itemType == BUTTON_SHADOW) == -1) {
                renderables.push(new ButtonShadow({}))
            }
        } 
        
        if (!mouse.hold) {
            this.held = false 
            let index = renderables.findIndex((item) => item.itemType == BUTTON_SHADOW)
            if (index > -1) { 
                renderables.splice(index, 1)
                renderables.push(new Unit({ position: { x: mouse.x - (this.width/2), y: mouse.y - (this.height/2) }, image: './farmer-2.png' }))
            }
        }
        
        this.setImage()
        Utils.setCursor(this.selected || this.held ? 'grab' : 'default')
        
        this.draw()
    }
}

class Unit extends Sprite {
    constructor(params) { super(params) }
    draw() { super.draw() }
    update() { this.draw() }
}

class ButtonShadow extends Button {
    constructor(params) {
        super(params)
        super.selected = true
        super.held = true  
        this.itemType = BUTTON_SHADOW
    }

    draw() {
        const mouse = GM.mouse 
        const farmer = `./farmer-2-selected.png`
        this.image = new Image()
        this.image.src = farmer 
        c.globalAlpha = 0.75
        c.drawImage(this.image, 0, 0, this.width, this.height, mouse.x - (this.width/2), mouse.y - (this.height/2), this.width, this.height)
        c.globalAlpha = 1
    }

    update() {
        this.draw()
    }
}

const button = new Button({ position: { x: TILE_SIZE * 3 + 10, y: 100 } })

const renderables = [button]

for (let x=0; x<3; x++) {
    for (let y=0; y<3; y++) {
        const color = colors[run % colors.length]
        const tile = new Tile({ position: { x: x * TILE_SIZE, y: y * TILE_SIZE }, width: TILE_SIZE, height: TILE_SIZE, color })
        renderables.push(tile)
        run++
    }
}

Events.register()
function animate() {
    requestAnimationFrame(animate) 
    c.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    c.fillStyle = '#333'
    c.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    renderables.forEach(r => r.update())
}
animate()