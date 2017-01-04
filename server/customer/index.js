const child_process = require("child_process")
const path = require("path")

let stopped = false
let kiosk = null
let kiosk_state = { cart: { items: [] } }

module.exports.init = () => {
	module.exports.loop()
}

module.exports.loop = () => {
	kiosk = child_process.spawn("python", [path.resolve(__dirname, "app.py")])
	kiosk.on("exit", () => {
		if (!stopped) {
			module.exports.loop()
		}
	})

	module.exports.update()
}

module.exports.update = () => {
	if (kiosk !== null) {
		kiosk.stdin.write(JSON.stringify(kiosk_state) + "\n")
	}
}

module.exports.clear = () => {
	stopped = true
	kiosk.stdin.pause()
	kiosk.kill()
}

module.exports.set = (state) => {
	kiosk_state = state
	module.exports.update()
}
