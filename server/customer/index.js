const Canvas = require("canvas")

let initialState = {
	paid: 0,
	cart: {
		items: []
	}
}

module.exports.render = (state = initialState) => new Promise((resolve, reject) => {
	let length = state.cart.items.length
	let width = 1280
	let height = 1024
	let canvas = new Canvas(width, height)
	let ctx = canvas.getContext("2d")

	let limit = 10
	let list = 850
	let padding = 30

	let rowSize = list / limit

	ctx.fillStyle = "#fff"
	ctx.fillRect(0, 0, width, height)
	ctx.save()

	for (let i = Math.max(0, length - limit); i < length; i++) {
		let item = state.cart.items[i]
		let relative = i - Math.max(0, length - limit) 
		let center = rowSize * (relative + .5)

		ctx.strokeStyle = "#aaa"
		ctx.fillStyle = "#333"
		ctx.beginPath()
		ctx.moveTo(0, rowSize * (relative + 1))
		ctx.lineTo(width, rowSize * (relative + 1))
		ctx.closePath()
		ctx.stroke()

		ctx.font = "32px sans-serif"
		ctx.textBaseline = "middle"


		ctx.textAlign = "center"
		ctx.fillText(i + 1, padding + 20, center)
		
		ctx.textAlign = "left"
		ctx.fillText(item.name, 120, center)
		
		ctx.textAlign = "right"
		ctx.fillText(item.price + " Kč", 800, center)
		ctx.fillText(item.qty + " ks", 1000, center)
		ctx.fillText((item.price * item.qty) + " Kč", width - padding, center)

	}

	ctx.restore()

	ctx.fillStyle = "#ab3dac"
	ctx.rect(0, list, width, height - list)
	ctx.fill()

	ctx.fillStyle = "#fff"
	ctx.font = "48px sans-serif"
	ctx.textBaseline = "middle"
	ctx.fillText("CELKEM: " + state.cart.items.reduce((memo, a) => memo + a.price * a.qty, 0) + " Kč", padding + 10, list + (height - list) / 2)

	let buffers = []
	let	stream = canvas.pngStream()

	stream.on("data", (buffer) => {
		buffers.push(buffer)
	})

	stream.on("end", () => {
		resolve(Buffer.concat(buffers))
	})
})