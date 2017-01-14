'use strict';
const native = require('./native')
const formatter = require("./formatter")

let printer = null
let seller = null

module.exports.init = (graph) => {
	seller = graph

	if (/^win/.test(process.platform)) {
		try {
			let device = new require("./usb")()
			device.open(() => printer = new require("./escpos")(device))
		} catch (err) { console.error("Printer not found") }
	} else {
		printer = new native("/dev/usb/lp0")
		printer.init().catch(err => {
			console.log(err)
			printer = null
		})
	} 	

}

module.exports.print = (customer) => {
	let items = customer.cart.items
	let total = items.reduce((memo, item) => memo + item.qty * item.price, 0)

	let date = new Date()
	if (customer.date) {
		date = new Date(Date.parse(customer.date))
	}

	let header = formatter.printHeader(seller.getSeller(total))
	let cart = formatter.printCart(items, total, customer.paid, date)
	return module.exports.printRaw([...header, ...cart])
}

module.exports.printRaw = (lines) => new Promise((resolve, reject) => {
	if (printer !== null) {
		formatter.print(lines).forEach(line => {
			printer.text(line)
		})

		printer.feed()
		resolve(true)
	} else {
		reject("Printer not ready")
	}
})