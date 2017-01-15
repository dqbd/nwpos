const Database = require("./database")

class Suggestions extends Database {
	suggest(price) {
		return this.getDb().then(db => new Promise((resolve, reject) => {
			db.find({}).exec((err, docs) => {
				if (err) {
					return reject(err)
				}

				resolve(docs.sort((a, b) => {
					let avg_a = a.total / a.bought
					let avg_b = b.total / b.bought
					return Math.abs(avg_a - price) - Math.abs(avg_b - price)
				}).map(a => a.name))
			})
		}))
	}

	getGrouped() {
		return this.getDb().then(db => new Promise((resolve, reject) => {
			db.find({}).exec((err, docs) => {
				if(err) {
					return reject(err)
				}

				let alphabet = {}
				docs.forEach(item => {
					let channel = item.name.trim().charAt(0)

					if (alphabet[channel] === undefined) {
						alphabet[channel] = []
					}

					alphabet[channel].push(item.name.trim())
				})

				let ordered = {}
				Object.keys(alphabet).sort((a,b) => a.localeCompare(b)).forEach(key => {
					ordered[key] = alphabet[key].sort((a,b) => a.localeCompare(b))
				})

				resolve(ordered)
			})
		}))
	}

	updateSuggestion(query, price) {
		return this.getDb().then(db => new Promise((resolve, reject) => {

			query = query.trim().toLowerCase()
			
			if (query.length == 0) {
				return resolve(false)
			}

			db.update({ name: query }, {
				$min: { min_price: price },
				$max: { max_price: price }, 
				$inc: { bought: 1, total: price }
			}, { upsert: true }, (err, updated) => {
				if (!err) {
					resolve(updated)
				} else {
					reject(err)
				}
			})	
		}))
	}
}

module.exports = Suggestions