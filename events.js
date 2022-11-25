const Events = { 
    register: () => { 
        window.addEventListener('mousemove', (e) => {
            const mousePos = {x: e.clientX, y: e.clientY }
            const pos = Utils.getExactPosition(mousePos)
            GM.mouse.x = pos.x 
            GM.mouse.y = pos.y  
        })
        window.addEventListener('mousedown', (e) => {
            GM.mouse.hold = true 
        })
        window.addEventListener('mouseup', (e) => {
            GM.mouse.hold = false
        }) 
        window.addEventListener('drag', (e) => {
            GM.mouse.hold = true 
        }) 
    }
}