const database = require("./database") 
const printer = require("./printer")
const display = require("./customer")
const eet = require("./eet")

class Interface {
	constructor(config, args) {
		this.config = config
		this.args = args

		if (args.display) {
			display.init()
		}
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
		customer.date = new Date()

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

	GET_LOGLIST() {
		return database.logs().getLogList()
	}

	GET_LOGS({day}) {
		return database.logs().retrieveLog(day)
	}

	POST_EET({total}) {
		let sellers = this.config.get().sellers
		if (sellers.length == 0) return Promise.reject("No seller")
		if (!sellers[0].eet.enabled) return Promise.reject("EET disabled")
		return eet.upload(sellers[0], total)
	}

	GET_CONFIG() {
		return Promise.resolve({ config: this.config.get() })
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