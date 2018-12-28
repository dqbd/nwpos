const child_process = require("child_process")
const path = require("path")
const os = require("os")

let stopped = false
let kiosk = null
let kiosk_state = { cart: { items: [], selection: 0 }, paid: 0, status: "STAGE_TYPING" }

let params = [] 

module.exports.init = (command, eanCallback) => {
	if (typeof command === "string") {
		params = command.split(" ").filter(a => a.trim().length > 0)
	} 

	console.log(params)
	if (params.length > 0) {
		module.exports.loop(eanCallback)
	}
}

module.exports.loop = (callback) => {
	console.log("spawning with", params)
	kiosk = child_process.spawn(params[0], params.slice(1), { 
		stdio: ['pipe', 'pipe', 'pipe']
	})

	kiosk.stdout.on("data", (data) => {
		const stringified = data.toString()
		if (callback && typeof callback === 'function') {
			if (stringified.trim().length > 0) {
				callback(stringified.trim())
			}
		}

		console.log(stringified)
	})

	kiosk.stderr.on("data", (data) => {
		console.log(data.toString())
	})
	

	kiosk.on("exit", () => {
		if (!stopped) {
			console.log("restarting")
			setTimeout(() => module.exports.loop(callback), 3000)
		}
	})

	kiosk.stdin.on("error", (err) => {
		if (!stopped) {
			console.log(err)
		}
	})

	kiosk.stdin.on("end", () => console.log("ended"))

	setTimeout(() => module.exports.update(), 1000)
}

module.exports.update = () => {
	if (kiosk !== null) {
		try {
			console.log("writing state")
			kiosk.stdin.write(JSON.stringify(kiosk_state) + "\n")
		} catch (e) {
			console.log("Failed to write to stdin")
		}
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
