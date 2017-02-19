const path = require("path")
const fs = require("fs")
const archiver = require("archiver")

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
		if (err) return reject(err)
		resolve(files.filter((file) => /\.db|\.json/.test(file)))
	})
}).then(files => {
	let archive = archiver("zip", { store: true })
	files.forEach((file) => {
		archive.append(fs.createReadStream(path.resolve(base, file)), { name: file })
	})
	archive.finalize()
	return archive
})