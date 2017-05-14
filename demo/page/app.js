var socket = io()

var viewer = document.getElementById("prints")
var scrollRelease = false
var newTop = 0

socket.on("print", function(data) {
    let print = document.createElement("pre")
    print.classList.add("print")
    print.classList.add("animated")
    print.classList.add("zoomIn")
    print.innerHTML = data

    viewer.appendChild(print)
    startScroll()
})

let interval = 1000 / 60
let then = Date.now()
let now = Date.now()
let delta = 0

let startScroll = () => {
    newTop = viewer.scrollTop
    scrollRelease = true
}

let scrolling = function() {
    requestAnimationFrame(scrolling)
    
    now = Date.now()
    delta = now - then

    if (viewer.parentElement.querySelector(":hover") === viewer) return startScroll()
    if (!scrollRelease || delta <= interval) return

    let t = newTop == viewer.scrollTop ? 1 : viewer.scrollTop / newTop
    let mod = Math.sqrt(t)
    let speed = Math.max(0.1, 25 * mod) 

    then = now - delta % interval
    viewer.scrollTop = Math.max(0, viewer.scrollTop - speed)

    if (viewer.scrollTop <= 0) {
        scrollRelease = false
    }
}

scrolling() 