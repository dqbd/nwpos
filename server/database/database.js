const nedb = require("nedb")
const path = require("path")

const storage = (dbname) => {
	let db = new nedb({ filename: path.resolve("data", dbname + ".db"), autoload: true })
	db.persistence.compactDatafile()
	return db
}

class Database {
	constructor() {
		this.db = {}
	}

	getDb(name = this.constructor.name.toLowerCase()) {
		return new Promise((resolve, reject) => {
			if (!this.db[name]) {
				this.db[name] = storage(name)
			}
			resolve(this.db[name])
		})
	}
}

module.exports = Database