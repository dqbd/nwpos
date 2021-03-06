"use strict"
const iconv = require("iconv-lite")
const fs = require("fs")

const _ = require("./commands")

class Printer {
	constructor(target) {
		this.target = target

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

	drawer(pin = 2) {
		return this.getStream().then(stream => {
			stream.write(Buffer.from(_.CASH_DRAWER["CD_KICK_"+pin]))
			this.closed = true
			stream.end()
		})
	}

	feed(native = false) {
		this.cache.push(Buffer.from(new Array(3).fill(_.EOL).join("")))
		this.cache.unshift(Buffer.from(_.CODEPAGE.WPC1250))

		let out = Buffer.concat(this.cache)
		this.cache.length = 0

		if (native) {
			return Promise.reject({ err: 'Native printer used', buffer: out })
		}

		return this.getStream().then(stream => {
			stream.write(out)
			this.closed = true
			stream.end()
		}).catch(err => {
			return Promise.reject({ err, buffer: out })
		})
	}
}

module.exports = Printer