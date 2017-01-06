'use strict';
const Printer = require('./printer')
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

module.exports.print = (lines) => new Promise((resolve, reject) => {
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