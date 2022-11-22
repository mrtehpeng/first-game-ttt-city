const Events = { 
    register: () => { 
        window.addEventListener('mousemove', (e) => {
            GM.mouse.x = e.clientX
            GM.mouse.y = e.clientY  
        })
        window.addEventListener('mousedown', (e) => {
            GM.mouse.hold = true 
        })
        window.addEventListener('mouseup', (e) => {
            GM.mouse.hold = false
        }) 
        window.addEventListener('drag', (e) => {
            console.log("drag")
            GM.mouse.hold = true 
        })
    }
}