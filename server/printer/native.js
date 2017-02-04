"use strict"
const iconv = require("iconv-lite")
const fs = require("fs")

const _ = require("./commands")

class Printer {
	constructor(target, autoclose = true) {
		this.target = target
		this.autoclose = autoclose

		this.cache = []

		this.stream = null
		this.closed = false
	}

	init() {
		return new Promise((resolve, reject) => {
			let stream = fs.createWriteStream(this.target)

			stream.on("open", () => {
				this.stream = stream
				this.closed = false
				resolve(stream)
			})

			stream.on("error", (err) => {
				//dump cache when printer not found
				this.cache.length = 0
				reject(err)
			})
		})
	}

	getStream() {
		if (this.stream == null || this.closed) {
			this.stream = null
			return this.init()
		} else {
			return Promise.resolve(this.stream)
		}
	}

	text(line) {
		this.cache.push(iconv.encode(line + _.EOL, "CP1250"))
	}

	align(align) {
		this.cache.push(Buffer.from(_.TEXT_FORMAT['TXT_ALIGN_' + align.toUpperCase()]))
	}

	feed() {
		this.cache.push(Buffer.from(new Array(3).fill(_.EOL).join("")))
		
		return this.getStream().then(stream => {
			stream.write(Buffer.concat(this.cache))

			if (this.autoclose) {
				this.closed = true
				stream.end()
			}

			this.cache.length = 0
		})
	}
}

module.exports = Printer