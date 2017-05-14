const Database = require("./database")

class Logs extends Database {
	getDb(date = this.retrieveDateString(new Date())) {
		return super.getDb(date)
	}

	retrieveDateString(date) {
		let dateString = []

		dateString.push(("0" + date.getDate()).slice(-2))
		dateString.push(("0" + (date.getMonth() + 1)).slice(-2))
		dateString.push(date.getFullYear())

		return dateString.join(".")
	}

	getDateFromString(str) {
		let a = str.split(".").map(a => Number.parseInt(a))
		return new Date(a[2], a[1]-1, a[0], 0, 0, 0, 0)
	}

	getLogList() {
		return super.listDb().then(files => {
			return files.filter(file => /[0-9]{2}\.[0-9]{2}\.[0-9]{4}\.db/.test(file)).sort((a, b) => {
				return this.getDateFromString(b).getTime() - this.getDateFromString(a).getTime()
			}).map(a => a.replace(".db", ""))
		})
	}

	retrieveLogs() {
		return this.getLogList().then(dates => {
			let final = Promise.resolve([])

			dates.forEach(date => {
				final = final.then((result) => new Promise(resolve => {
					return this.retrieveLog(date).then(log => {
						result.push(log)
						resolve(result)
					}).catch(err => {
						resolve(result)
					})
				}))
			})

			return final
		})
	}

	retrieveLog(date) {
		return this.getDb(date).then(db => new Promise((resolve, reject) => {
			db.find({}).sort({date: -1}).exec((err, data) => {
				if (err) {
					return reject(err)
				}

				resolve({
					date: date,
					total: data.reduce((memo, customer) => {
						let total = customer.cart.items.reduce((memo, item) => memo + item.price * item.qty, 0)
						return memo + total
					}, 0),
					customers: data
				})
			})
		}))
	}

	updateLog(date, id, data) {
		return this.getDb(date).then(db => new Promise((resolve, reject) => {
			db.update({ _id: id }, data, (err, updated) => {
				if (err) return reject(err)
				resolve(updated)
			})	
		}))
	}

	logCustomer(customer) {
		return this.getDb().then(db => new Promise((resolve, reject) => {
			db.insert(customer, (err) => {
				if (err) {
					return reject(err)
				} 
				resolve(true)
			})
		}))
	}
}

module.exports = Logs

