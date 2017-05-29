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

	retrieveLog(date, detailed = false) {
		return this.getDb(date).then(db => new Promise((resolve, reject) => {
			db.find({}).sort({date: -1}).exec((err, data) => {
				if (err) {
					return reject(err)
				}

				let dayTotal = data.reduce((sum, customer) => {
					let total = customer.cart.items.reduce((memo, item) => memo + item.price * item.qty, 0)

					if (detailed) {
						let index = !customer.seller ? "0" : customer.seller 
						if (sum === 0) sum = {}
						if (!sum[index]) sum[index] = 0

						sum[index] += total
						return sum
					} else {
						return sum + total
					}
				}, 0)

				resolve({
					date: date,
					total: dayTotal,
					customers: data
				})
			})
		}))
	}

	retrieveSummary() {
		return this.getLogList().then(days => {
			let mappings = {}

			for (let day of days) {
				let [date, month, year] = day.split(".")
				let tag = month + "." + year
				if (!mappings[tag]) mappings[tag] = {days: 0, list: []}

				mappings[tag].list.push(day)
				mappings[tag].days++ 
			}

			return mappings
		}).then(maps => {
			return this.getDb("summary").then(db => {
				let final = Promise.resolve([])
				let currentSeason = this.retrieveDateString(new Date()).split(".").slice(1).join(".")

				Object.keys(maps).forEach((season) => {
					let { days, list } = maps[season]

					final = final.then((result) => new Promise((resolve, reject) => {
						db.find({ period: season, days: { $gte: days } }, (err, data) => {
							if (err) return reject(err)
							if (data.length > 0 && season !== currentSeason) return resolve([...result, data[0]])

							// TODO: update only current day
							// calculate sum
							let summer = Promise.resolve({})
							for (let date of list) {
								summer = summer.then((total) => this.retrieveLog(date, true).then(log => {
									if (Object.keys(log.total).length <= 0) total = {"0": 0} 
									for (let key of Object.keys(log.total)) {
										if (!total[key]) total[key] = 0
										total[key] += log.total[key]
									}
									return total
								}))
							}
							
							summer.then(total => {
								// NOTE: returnUpdatedDocs is incompatible with MongoDB
								db.update({ period: season }, { period: season, days, total }, { upsert: true, returnUpdatedDocs: true }, (err, num, affected) => {
									if (err) return reject(err)
									resolve([...result, affected])
								})
							})
						})	
					}))
				})

				return final
			})
		})
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

