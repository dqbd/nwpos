const path = require("path")
const base = path.resolve(__dirname, "..", "data")

let available = {
	suggestion: require("./suggestions"),
	logs: require("./logs")
}

let instances = {}

Object.keys(available).forEach(dbname => {
	module.exports[dbname] = () => {
		if (instances[dbname] === undefined) {
			return instances[dbname] = new available[dbname](base)
		}

		return instances[dbname]
	}
})

module.exports.backup = () => new Promise((resolve, reject) => {
	fs.readdir(base, (err, files) => {
		if (err) {
			return reject(err)
		}
		resolve(files.filter(file => /\.db/.test(file)))
	})
}).then(files => {
	//TODO: zip all the files
	//TODO: upload to our backup
})

