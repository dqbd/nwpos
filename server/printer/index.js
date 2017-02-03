'use strict';
const native = require('./native')
const formatter = require("./formatter")
const os = require("os")

let printer = null
let config = null

module.exports.init = (src) => {
	config = src

	if (os.platform() === "win32") {
		printer = new native(`\\\\${os.hostname()}\\nwcashier-printer`, true)
	} else {
		printer = new native("/dev/usb/lp0")
	} 	

	printer.init().catch(err => {
		console.log(err)
		printer = null
	})
}

module.exports.print = (customer) => {
	let items = customer.cart.items
	let total = items.reduce((memo, item) => memo + item.qty * item.price, 0)

	let date = new Date()
	if (customer.date) {
		date = new Date(Date.parse(customer.date))
	}

	if (config.get().sellers.length > 0) {
		let seller = config.get().sellers[0]

		let header = formatter.printHeader(seller)
		let cart = formatter.printCart(items, total, customer.paid, date, seller.tax ? 21 : 0)
		return module.exports.printRaw(["$center", ...header, "$left", ...cart])
	} else {
		return Promise.reject("No seller info")
	}
}

module.exports.printRaw = (lines) => new Promise((resolve, reject) => {
	if (printer !== null) {
		formatter.print(lines).forEach(line => {

			if (line.indexOf("$center") == 0) {
				printer.align("CT")
			} else if (line.indexOf("$left") == 0) {
				printer.align("LT")
			} else {
				printer.text(line)
			}

		})

		printer.feed()
		resolve(true)
	} else {
		reject("Printer not ready")
	}
})

