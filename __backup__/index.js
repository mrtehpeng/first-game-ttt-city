const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576 

GameManager.initTiles()
GameManager.initPlayer()

function animate() {
    const animationId = window.requestAnimationFrame(animate) 
    c.clearRect(0, 0, canvas.width, canvas.height)
    // Generate and save tiles 
    // Put units and buildings into respective tiles 

    GameManager.renderables.forEach((renderable) => { 
        renderable.update(GameManager.mouse)
    })
}

animate()


window.addEventListener("mousemove", (event) => {
    GameManager.mouse.x = event.clientX
    GameManager.mouse.y = event.clientY 
    if (GameManager.mouseState == MOUSESTATE.DOWN) {  
        setMouseState(MOUSESTATE.DRAG) 
        GameManager.processUnitMouseovers(MOUSESTATE.DRAG, GameManager.mouse) 
    } else if (GameManager.mouseState != MOUSESTATE.DRAG) { 
        setMouseState(MOUSESTATE.MOVE) 
        GameManager.processUnitMouseovers(MOUSESTATE.MOVE, GameManager.mouse) 
    }
})

window.addEventListener("dragend", (event) => {  
    GameManager.mouse.holding = false
    setMouseState(MOUSESTATE.IDLE)
})

window.addEventListener("mouseup", (event) => { 
    GameManager.mouse.holding = false
    setMouseState(MOUSESTATE.UP)
})
window.addEventListener("mousedown", (event) => { 
    GameManager.mouse.holding = !GameManager.mouse.holding 
    setMouseState(MOUSESTATE.DOWN)

    // if exists isHolding and is over x,
    // put unit into x

    // if is over x, x is selected.
})

window.addEventListener("dragstart", (event) => { 
    GameManager.mouse.holding = true 
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
