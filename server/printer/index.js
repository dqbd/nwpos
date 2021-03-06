'use strict';
const native = require('./native')
const formatter = require("./formatter")
let printer = null
let config = null

module.exports.init = (src, args) => {
	config = src
	printer = new native(args.printer)
}

module.exports.print = (customer, native = false) => {
	let items = customer.cart.items
	let total = items.reduce((memo, item) => memo + item.qty * item.price, 0)

	let date = new Date()
	if (customer.date) {
		date = new Date(Date.parse(customer.date))
	}
	if (customer.services.eet && customer.services.eet.datTrzby) {
		date = new Date(Date.parse(customer.services.eet.datTrzby))
	}

	if (config.get().sellers.length > 0) {
		let seller = config.get().sellers.find((seller) => seller.ic === customer.seller)

		if (!seller) {
			seller = config.get().sellers[0]
		}

		let header = formatter.printHeader(seller)
		let cart = formatter.printCart(items, total, customer.paid, date, seller.tax ? 21 : 0)
		let eet = formatter.printEet(customer.services.eet, seller)

		return module.exports.printRaw(["$center", ...header, "$left", ...cart, ...eet], native)
	} else {
		return Promise.reject("No seller info")
	}
}

module.exports.drawer = (pin = 2) => printer.drawer(pin)

module.exports.printRaw = (lines, native = false) => new Promise((resolve, reject) => {
	console.log(lines)
	formatter.print(lines).forEach(line => {
		if (line.indexOf("$center") == 0) {
			printer.align("CT")
		} else if (line.indexOf("$left") == 0) {
			printer.align("LT")
		} else {
			printer.text(line)
		}
	})

	printer.feed(native).then(a => {
		resolve(true)
	}).catch(err => {
		reject({ err: err.err, buffer: err.buffer.toJSON().data })
	})
})

