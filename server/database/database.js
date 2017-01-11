const nedb = require("nedb")
const path = require("path")
const fs = require("fs")

const storage = (base, dbname) => {
	let db = new nedb({ filename: path.resolve(base, dbname + ".db"), autoload: true })
	db.persistence.compactDatafile()
	return db
}

class Database {
	constructor(base) {
		this.base = base
		this.db = {}
	}

	getDb(name = this.constructor.name.toLowerCase()) {
		return new Promise((resolve, reject) => {
			if (!this.db[name]) {
				this.db[name] = storage(this.base, name)
			}
			resolve(this.db[name])
		})
	}

	listDb() {
		return new Promise((resolve, reject) => {
			fs.readdir(this.base, (err, files) => {
				if (err) {
					return reject(err)
				}
				resolve(files.filter(file => /\.db/.test(file)))
			})
		})
	}
}

module.exports = Database