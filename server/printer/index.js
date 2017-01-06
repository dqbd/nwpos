'use strict';
const Printer = require('./printer')
const formatter = require("./formatter")

let printer = null

module.exports.init = () => {
	try {
		let device = null
		if (/^win/.test(process.platform)) {
			const usb = require("./usb")
			device = new usb()
		} else {
			const serial = require("./serial")
			device = new serial("/dev/usb/lp0")
		}

		device.open(() => printer = new Printer(device))
	} catch (err) { console.error("Printer not found") }
}

module.exports.print = (customer) => {
	let items = customer.cart.items
	let total = items.reduce((memo, item) => memo + item.qty * item.price, 0)

	let date = new Date()
	if (customer.date) {
		date = new Date(Date.parse(customer.date))
	}

	let lines = formatter.printCart(items, total, customer.paid, date)
	return module.exports.printRaw(lines)
}

module.exports.printRaw = (lines) => new Promise((resolve, reject) => {
	console.log(lines)
	if (printer !== null) {
		lines.forEach((line) => {
			printer.text(line)
		})

		printer.feed()
		resolve(true)
	} else {
		reject("Printer not ready")
	}
})