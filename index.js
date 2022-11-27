const canvas = document.querySelector('canvas')

canvas.width = CANVAS_WIDTH
canvas.height = CANVAS_HEIGHT
const c = canvas.getContext('2d')
c.fillStyle = '#333'
c.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

class Sprite {
    constructor({
        position,
        imageSrc='', 
        width=0,
        height=0,
        frames= {max: 1}, 
        color=''
      }) {
        this._id = Utils.randStr(16)
        this.position = { ...position, offsetX: 0, offsetY: 0 }
        this.width = width
        this.height = height 
        this.image = new Image()
        this.image.src = imageSrc
        this.color=color
        this.frames = {
            max: frames.max,
            current: 0,
            elapsed: 0,
            hold: 0
        }
        this.opacity = 1
    }  

    switchSprite(state='idle') {
        switch(state) {
            case 'idle': {
                if (this.image.src !== this.sprites.idle.image) {
                    this.image.src = this.sprites.idle.image 
                    this.frames.max = this.sprites.idle.frames.max 
                    this.frames.current=0
                }
                break 
            }
            
            case 'selected': {
                if (this.image.src !== this.sprites.selected.image) {
                    this.image.src = this.sprites.selected.image 
                    this.frames.max = this.sprites.selected.frames.max 
                    this.frames.current=0
                }
                break 
            }
        }
    }

    draw() {
        const position = this.position // Utils.getExactPosition(this.position)
        if (this.color != '')  { 
            if (this.color != '') c.fillStyle = this.color 
            c.fillRect(position.x, position.y, this.width, this.height)
        } else if (this.image) {  
            const crop = {
                x: this.frames.current * (this.image.width/this.frames.max),
                y: 0
            }
            c.imageSmoothingEnabled = false;
            c.globalAlpha = this.opacity
            c.drawImage(this.image, crop.x, crop.y, this.image.width/this.frames.max, this.image.height, position.x + this.position.offsetX, position.y + this.position.offsetY, (this.image.width/this.frames.max), this.image.height) 
            c.globalAlpha = 1
        }
    }

    animateFrames() {
        this.frames.elapsed++ 
        if (this.frames.elapsed % this.frames.hold === 0) {
          if (this.frames.current < this.frames.max - 1) {
            this.frames.current++
          } else {
            this.frames.current = 0
          }
        }
      }

    update() {  
        this.draw()
        this.animateFrames()
    }
}

class Tile extends Sprite {
    constructor(params) {
        super(params)
        const { tileType } = params 
        this.tileType = tileType
        this.spriteType = SPRITETYPE.TILE
        this.setSprite()
        this.switchSprite()
    } 

    setSprite() {
        this.sprites = TileRsc[this.tileType] ?? TileRsc[TILETYPE.GRASS]
    }

    update() {
        this.draw()
        const mouse = GM.mouse 
        this.selected = Utils.checkCollision(mouse.x, mouse.y, this.position.x, this.position.y, this.image.width, this.image.height)
        this.switchSprite(this.selected ? 'selected' : 'idle')
    }
}

class Unit extends Sprite {
    constructor(params) { 
        super(params) 
        const { unitType='farmer'} = params 
        this.unitType = unitType
        this.setSpriteBasedOnUnitType()
        this.switchSprite()
        this.spriteType = SPRITETYPE.UNIT 
    } 

    setSpriteBasedOnUnitType() {
        switch(this.unitType) {
            case 'farmer': 
                this.sprites = {
                    selected: {
                        image: './farmer-2-selected.png',
                        frames: { max: 1 }
                    },
                    idle: {
                        image: './farmer-2.png',
                        frames: {max: 1}
                    }
                }
            break
        }
    }

    update() { 
        this.draw()
        const mouse = GM.mouse
        let selected = this.selected 
        this.selected = Utils.checkCollision(mouse.x, mouse.y, this.position.x, this.position.y, this.image.width, this.image.height)
        if (this.selected) this.held = mouse.hold
        if (selected != this.selected) { 
            Utils.setCursor(this.selected || this.held ? 'grab' : 'default')
        }
        this.switchSprite(this.selected ? 'selected' : 'idle') 
        
    }
}

class Number {
    constructor(params) { 
        const { number, position } = params 
        this.number = number  
        this.position = position  
        switch (number) {
            case 1: case 2: 
            case 3: case 4: 
            case 5: this.crop = { x: 16 * (number - 1), y: 0 }; break
            case 0: this.crop = { x: 16 * 4, y: 0 }; break  
            default: this.crop = { x: 16 * ((number - 1) % 5), y: 16 }; break 
        }
    }

    draw() {
        const NUM_SIZE = 16
        const image = new Image()
        image.src = './numbers.png' 
        c.drawImage(image, this.crop.x, this.crop.y, NUM_SIZE, NUM_SIZE, this.position.x, this.position.y, NUM_SIZE, NUM_SIZE)
    }

    update() { this.draw() }
}

class Card extends Sprite {
    /**
     * tileIndex = 0 ~ 8
     * cardIndex = 0 ~ 4
     * @param {*} params 
     */
    constructor(params) { 
        super(params) 
        const { cardType='card', spriteType=SPRITETYPE.CARD, tileIndex, cardIndex } = params 
        this.cardType = cardType
        this.setSpriteBasedOnUnitType()
        this.switchSprite() 
        this.setStats() 
        this.spriteType = spriteType
        this.tileIndex=tileIndex 
        this.cardIndex=cardIndex
        this.isTopCard=false 
        this.isDragged = false 
    } 

    setStats() {
        this.stats = UNITSTATS[this.cardType] ?? UNITSTATS['card']
    }

    setSpriteBasedOnUnitType() {
        this.sprites = CardRsc[this.cardType] ?? CardRsc['card']
    }

    setCardPositionBasedOnIndex(tile, index, isTop=false) {
        this.position.x = ((tile % 3) * TILE_SIZE) + 3 + ((index % 5) * 17) 
        this.position.y = (Math.floor(tile / 3) * TILE_SIZE) + 36
        this.cardIndex=index
        this.isTopCard=isTop
    }

    drawStats() { 
        // Draw stats
        const Y = this.position.y + this.position.offsetY
        const attk = new Number({ position: {x: this.position.x + 70, y: Y + 42 }, number: this.stats.attk })
        const def = new Number({ position: {x: this.position.x + 70, y: Y + 57 }, number: this.stats.def })
        const hp = new Number({ position: {x: this.position.x + 70, y: Y + 72 }, number: this.stats.hp }) 
        attk.update()
        def.update()
        hp.update()
    }

    update() { 
        this.draw()

        const mouse = GM.mouse
        const selected = this.selected 
        const w = this.isTopCard ? this.image.width : (this.cardIndex < 4 ? 17 : this.image.width)
        this.selected = Utils.checkCollision(mouse.x, mouse.y, this.position.x, this.position.y,  w, this.image.height)
        if (this.selected) this.held = mouse.hold

        if (selected != this.selected) { 
            // Selection change 
            Utils.setCursor(this.selected || this.held ? 'grab' : 'default')
            this.held = false
        } 

        if (draggedCard && draggedCard._id == this._id) this.isDragged = draggedCard
        else this.isDragged = false

        if (draggedCard && (this.selected || this.isDragged)) this.position.offsetY = -10
        else this.position.offsetY = 0

        this.drawStats()

        this.switchSprite(this.selected ? 'selected' : 'idle') 

        // Add ButtonShadow
        if (this.held || this.isDragged) { 
            if (buttonShadows.length == 0) { 
                const buttonShadow = new CardShadow({ position: { x: mouse.x - (this.image.width/2), y: mouse.y - (this.image.height/2) }, stats: this.stats, source: this, cardType: this.cardType })
                //console.log(` Card #${this.cardIndex}: Add new button shadow `, buttonShadow)
                buttonShadows.push(buttonShadow)
                this.isDragged=true
                this.opacity = 0.65
                draggedCard = this 
            }
        } else { 
            this.opacity = 1
        }
    }
}

class Button extends Card {
    constructor(params) {  
        super(params)  
        const { cardType } = params 
        this.cardType = cardType
        this.spriteType = SPRITETYPE.BUTTON
        this.setSpriteBasedOnUnitType()
        this.switchSprite()
        this.width = this.image.width  
        this.height = this.image.height
    }   

    setSpriteBasedOnUnitType() {
        this.sprites = CardRsc[this.cardType] ?? CardRsc['card']
    }

    update() {
        this.draw()
        this.drawStats()
        const mouse = GM.mouse
        this.held = mouse.hold
        let selected = this.selected 
        this.selected = Utils.checkCollision(mouse.x, mouse.y, this.position.x, this.position.y, this.image.width, this.image.height)
        if (selected != this.selected) { 
            Utils.setCursor(this.selected || this.held ? 'grab' : 'default')
        }
        this.switchSprite(this.selected ? 'selected' : 'idle') 
        // Add ButtonShadow
        if (this.selected && this.held) { 
            if (buttonShadows.length == 0) {
                draggedCard=this
                buttonShadows.push(new CardShadow({ position: { x: mouse.x - (this.image.width/2), y: mouse.y - (this.image.height/2) }, stats: UNITSTATS[this.cardType], source: this, cardType: this.cardType }))
            }
        } 
        
    }
}

class CardShadow extends Card {
    constructor(params) {
        super({ ...params })
        const { cardType, source, stats } = params
        this.stats = stats 
        this.selected = true
        this.held = true   
        this.source = source
        this.cardType = cardType 
        this.spriteType = SPRITETYPE.BUTTONSHADOW 
    }

    getCardImage() {
        return ButtonShadowRsc[this.cardType] ?? './card.png' 
    }

    draw() {
        const mouse = GM.mouse 
        const farmer = this.getCardImage()
        this.image = new Image()
        this.image.src = farmer 
        c.globalAlpha = 0.75
        c.drawImage(this.image, 0, 0, this.image.width, this.image.height, mouse.x - (this.image.width/2), mouse.y - (this.image.height/2), this.image.width, this.image.height)
        c.globalAlpha = 1
    }

    update() {
        this.draw()
        const mouse = GM.mouse  
        this.position = mouse
        // Draw stats
        const X = this.position.x - (this.image.width/2)
        const Y =this.position.y - (this.image.height/2)
        const attk = new Number({ position: {x: X + 70, y: Y + 42 }, number: this.stats.attk })
        const def = new Number({ position: {x: X + 70, y: Y + 57 }, number: this.stats.def })
        const hp = new Number({ position: {x: X + 70, y: Y + 72 }, number: this.stats.hp }) 
        attk.update()
        def.update()
        hp.update()
        
        this.held = mouse.hold 
        if (!this.held) {
            let tileIndex = Utils.checkOverTile(mouse.x, mouse.y)
            console.log(` Over tile? index=${tileIndex}`)
            if (draggedCard) { 
                // Put ButtonShadow down   
                if (buttonShadows.length == 1 && tileIndex > -1) {  
                    let cardLength = tiles[tileIndex].cards.length 
                    const isSameIndex = draggedCard.tileIndex == tileIndex
                    let addCard = isSameIndex || cardLength < 5 
                    if (addCard) { 
                        const card = new Card({ 
                            tileIndex: tileIndex,
                            cardIndex: cardLength,
                            cardType: draggedCard.cardType,
                            position: { x: mouse.x - (this.image.width/2), y: mouse.y - (this.image.height/2) }, 
                        })
                        //console.log(` Put new card on tile #${tileIndex} ${tiles[tileIndex].cards.length}`, card)
                        //console.log(` Current source `, this.source)

                        // Reset held card 'held' to false
                        if (draggedCard.spriteType == SPRITETYPE.CARD) { 
                            tiles[draggedCard.tileIndex].cards.splice(draggedCard.cardIndex, 1)
                            draggedCard = null
                            //tiles[this.source.tileIndex].cards[this.source.cardIndex].held = false
                        }

                        tiles[tileIndex].cards.push(card)
                    }
                }
                
                buttonShadows.length = 0
            }
        }
    }
}

class ButtonShadow extends Button {
    constructor(params) {
        super({ ...params })
        const { cardType, source } = params 
        this.selected = true
        this.held = true   
        this.source = source
        this.cardType = cardType 
        this.spriteType = SPRITETYPE.BUTTONSHADOW
    }

    getCardImage() {
        return ButtonShadowRsc[this.cardType] ?? './card.png' 
    }

    draw() {
        const mouse = GM.mouse 
        const farmer = this.getCardImage()
        this.image = new Image()
        this.image.src = farmer 
        c.globalAlpha = 0.75
        c.drawImage(this.image, 0, 0, this.image.width, this.image.height, mouse.x - (this.image.width/2), mouse.y - (this.height/2), this.image.width, this.image.height)
        c.globalAlpha = 1
    }

    update() {
        this.draw()
        const mouse = GM.mouse  
        this.held = mouse.hold 
        if (!this.held) {
            let tileIndex = Utils.checkOverTile(mouse.x, mouse.y)
            console.log(` Over tile? index=${tileIndex}`)
            if (draggedCard && tileIndex > -1) { 
                // Put ButtonShadow down   
                if (buttonShadows.length == 1) {  
                    let cardLength = tiles[tileIndex].cards.length 
                    const isSameIndex = draggedCard.tileIndex == tileIndex
                    let addCard = isSameIndex || cardLength < 5 
                    if (addCard) { 
                        const card = new Card({ 
                            tileIndex: tileIndex,
                            cardIndex: cardLength,
                            cardType: draggedCard.cardType,
                            position: { cardType: this.cardType, x: mouse.x - (this.image.width/2), y: mouse.y - (this.image.height/2) }, 
                        })
                        //console.log(` Put new card on tile #${tileIndex} ${tiles[tileIndex].cards.length}`, card)
                        //console.log(` Current source `, this.source)

                        // Reset held card 'held' to false
                        if (draggedCard.spriteType == SPRITETYPE.CARD) { 
                            tiles[draggedCard.tileIndex].cards.splice(draggedCard.cardIndex, 1)
                            draggedCard = null
                            //tiles[this.source.tileIndex].cards[this.source.cardIndex].held = false
                        }

                        tiles[tileIndex].cards.push(card)
                    }
                    buttonShadows.length = 0
                }
            }
        }
    }
}

const cardButton = new Button({ 
    draggable: false,
    position: { x: TILE_SIZE * 3 + 10, y: 100 }, 
    cardType: 'card', 
}) 

const goldCardButton = new Button({ 
    spriteType: SPRITETYPE.CARDBUTTON,
    position: { x: TILE_SIZE * 3 + 10, y: TILE_SIZE + 100 }, 
    cardType: 'gold-card', 
}) 

let draggedCard = null
const renderables = [cardButton, goldCardButton]
const tiles = []
const buttonShadows = []
GM.generateTiles()

let turn = 1
let elapsed = 0
Events.register()
function animate() {
    requestAnimationFrame(animate) 
    if (elapsed % 2 == 0) { 
        c.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        c.fillStyle = '#333'
        c.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        renderables.forEach(r => r.update())
        tiles.forEach((tile, tindex) => {
            tile.cards.forEach((card, index) => {
                let isTop = index == tile.cards.length - 1
                card.setCardPositionBasedOnIndex(tindex, index, isTop)
                card.update()
            })
        })
        buttonShadows.forEach((buttonShadow) => buttonShadow.update())
    }
    elapsed++
}
animate()