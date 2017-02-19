const database = require("./database") 
const printer = require("./printer")
const display = require("./customer")
const eet = require("./eet")

const timer = require("./eet/timer")

class Interface {
	constructor(config, args) {
		this.config = config
		this.args = args
		this.timer = timer.init(config, database)

		if (args.display) {
			display.init()
		}

		this.timer.enqueue()
		printer.init(config, args)
	}

	destroy() {
		display.clear()
	}

	GET_SUGGEST() {
		return database.suggestion().getGrouped()
	}

	POST_SUGGEST({price}) {
		if (price === undefined) {
			return Promise.reject("Invalid arguments")
		}

		return database.suggestion().suggest(Number.parseFloat(price))
	}

	POST_STREAM({customer}) {
		if (customer === undefined) {
			return Promise.reject("Invalid arguments")
		}

		display.set(customer)
		return Promise.resolve(customer)
	}

	POST_STORE({customer}) {
		if (customer === undefined) {
			return Promise.reject("Invalid arguments")
		}

		let items = customer.cart.items

		let date = Date.parse(customer.date)
		customer.date = Number.isNaN(date) ? new Date() : new Date(date)

		return database.logs().logCustomer(customer)
			.then(a => Promise.all(items.map(item => database.suggestion().updateSuggestion(item["name"], item["price"]))))
			.then(a => database.suggestion().getGrouped())
	}

	POST_PRINT({customer}) {
		if (customer === undefined) {
			return Promise.reject("Invalid arguments")
		}

		return printer.print(customer)
	}

	GET_DRAWER({pin}) {
		return printer.drawer(pin)
	}

	GET_LOGLIST() {
		return database.logs().getLogList()
	}

	GET_LOGS({day}) {
		return database.logs().retrieveLog(day)
	}

	POST_EET({total, ic}) {
		let sellers = this.config.get().sellers
		if (sellers.length == 0) return Promise.reject("No seller")

		let seller = sellers.find((seller) => seller.ic === ic)
		if (!seller) {
			seller = sellers[0]
		}

		if (!seller.eet.enabled) return Promise.reject("EET disabled")
		return eet.upload(seller, total)
	}

	GET_SELLERS() {
		return Promise.resolve({ 
			sellers: this.config.get().sellers.map(seller => {
				return { name: seller.name, ic: seller.ic }
			}) 
		})
	}

	GET_CONFIG() {
		return Promise.resolve({ config: this.config.get() })
	}

	GET_DEBUG() {
		return Promise.resolve({ debug: this.config.get().debug === true })
	}

	POST_CONFIG({config}) {
		this.config.set(config)
		return Promise.resolve({ config: this.config.get() })
	}

	POST_P12_FILE({file, pass}) {
		return eet.validateCert(file.filename, pass)
	}

	GET_BACKUP_PIPE() {
		return database.backup()
	}
}

module.exports = (config, args) => new Interface(config, args)