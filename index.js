const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576 

GameManager.initTiles()
GameManager.initPlayer()

const mouse = {
    x: 0, y: 0, holding: false
}
GameManager.renderables.push(...GameManager.allTiles) 
GameManager.renderables.push(...GameManager.allResources) 
GameManager.renderables.push(...GameManager.allUnits)

function animate() {
    const animationId = window.requestAnimationFrame(animate) 
    
    // Generate and save tiles 
    // Put units and buildings into respective tiles 

    GameManager.renderables.forEach((renderable) => { 
        renderable.update(mouse)
    })
}

animate()


window.addEventListener("mousemove", (event) => {
    mouse.x = event.clientX
    mouse.y = event.clientY
    if (GameManager.mouseState == MOUSESTATE.DOWN) {  
        setMouseState(MOUSESTATE.DRAG) 
        GameManager.processUnitMouseovers(MOUSESTATE.DRAG, mouse) 
    } else if (GameManager.mouseState != MOUSESTATE.DRAG) { 
        setMouseState(MOUSESTATE.MOVE) 
        GameManager.processUnitMouseovers(MOUSESTATE.MOVE, mouse) 
    }
})

window.addEventListener("dragend", (event) => { 
    mouse.holding = false 
    setMouseState(MOUSESTATE.IDLE)
})

window.addEventListener("mouseup", (event) => { 
    mouse.holding = false
    setMouseState(MOUSESTATE.UP)
})
window.addEventListener("mousedown", (event) => { 
    mouse.holding = !mouse.holding 
    setMouseState(MOUSESTATE.DOWN)

    // if exists isHolding and is over x,
    // put unit into x
})

window.addEventListener("dragstart", (event) => { 
    mouse.holding = true 
    setMouseState(MOUSESTATE.DRAG)
})

canvas.addEventListener('click', (event) => {
    if (GameManager.mouseState != MOUSESTATE.UP)
        setMouseState(MOUSESTATE.CLICK)
    // if (activeTile && !activeTile.isOccupied && coins - 50 >= 0) {
    //   coins -= 50
    //   document.querySelector('#coins').innerHTML = coins
    //   buildings.push(
    //     new Building({
    //       position: {
    //         x: activeTile.position.x,
    //         y: activeTile.position.y
    //       }
    //     })
    //   )
    //   activeTile.isOccupied = true
    //   buildings.sort((a, b) => {
    //     return a.position.y - b.position.y
    //   })
    // }
})
