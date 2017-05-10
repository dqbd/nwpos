var socket = io()

var viewer = document.getElementById("prints")

socket.on("print", function(data) {
    let print = document.createElement("pre")
    print.classList.add("print")
    print.innerHTML = data

    viewer.appendChild(print)
})

let interval = 1000 / 60
let then = Date.now()
let now = Date.now()
let delta = 0

let scrolling = function() {
    requestAnimationFrame(scrolling)

    now = Date.now()
    delta = now - then

    if (delta > interval) {
        then = now - delta % interval

        viewer.scrollTop = Math.max(0, viewer.scrollTop - 10)
    }
}

scrolling() 