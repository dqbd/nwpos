const child_process = require("child_process")
const path = require("path")
const os = require("os")

let stopped = false
let kiosk = null
let kiosk_state = { cart: { items: [], selection: 0 }, paid: 0, status: "STAGE_TYPING" }

let params = [] 

module.exports.init = (width = 800, height = 600, window = true) => {

	if (width > 0) params.push(width)
	if (height > 0) params.push(height)
	if (window) params.push("--windowed")

	module.exports.loop()
}

module.exports.loop = () => {
	kiosk = child_process.spawn(os.platform() === "win32" ? "pythonw" : "python", [path.resolve(__dirname, "app.py"), ...params])

	kiosk.stdout.on("data", (data) => {
		console.log(data.toString())
	})

	kiosk.stderr.on("data", (data) => {
		console.log(data.toString())
	})
	

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
	kiosk_state = Object.assign(kiosk_state, state)
	module.exports.update()
}
