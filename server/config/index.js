const fs = require("fs")
const path = require("path")

const { defaultSeller } = require("./defaultSeller")

class Config {
	constructor(base) {
		this.src = path.resolve(base, "config.json")
		this.state = {}
		this.load()
	}

	load() {
		let src = {}
		let initial = {
			"sellers": []
		}

		try {
			let data = JSON.parse(fs.readFileSync(this.src))
			if (typeof data === "object") {
				src = data
			}
		} catch (e) {}

		src = Object.assign(initial, src)

		// attempt fixing sellers
		src.sellers = src.sellers.map(seller => Object.assign({}, defaultSeller, seller))
		
		this.state = src
		this.save()
	}

	save() {
		try {
			fs.writeFileSync(this.src, JSON.stringify(this.state))
		} catch (e) {
			console.error("Failed to save configuration", e)
		}
	}

	set(data) {
		this.state = Object.assign(this.state, data)
		this.save()
	}

	get() {
		return this.state
	}

}

module.exports = () => {
	const base = path.resolve(__dirname, "..", "data")
	return new Config(base)
}