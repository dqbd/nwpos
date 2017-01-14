"use strict"
const iconv = require("iconv-lite")
const fs = require("fs")

const _ = require("./commands")

class Printer {
	constructor(target) {
		this.target = target
	}

	init() {
		return new Promise((resolve, reject) => {
			let stream = fs.createWriteStream(this.target)

			stream.on("open", () => {
				this.stream = stream
				resolve()
			})

			stream.on("error", (err) => {
				reject(err)
			})
		})
	}

	text(line) {
		this.stream.write(iconv.encode(line + _.EOL, "CP1250"))
	}

	feed() {
		this.stream.write(new Array(3).fill(_.EOL).join(""))
	}
}

module.exports = Printer