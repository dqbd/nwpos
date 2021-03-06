const fs = require("fs")
const path = require("path")

const pem = require("pem")
const uuid = require("node-uuid")

const cache = {}

module.exports.getCertFile = (filename) => {
	return path.resolve(__dirname, "..", "data", filename)
}

module.exports.deleteCert = (filename) => {
    try {
        fs.unlinkSync(module.exports.getCertFile(filename))
    } catch (err) { console.log(err) }
}

module.exports.retrieveCert = (filename, pass) => new Promise((resolve, reject) => {
	let key = [filename, pass].join("")

	if (!cache[key]) {
		pem.readPkcs12(module.exports.getCertFile(filename), {p12Password: pass}, (err, result) => {
			if (err) return reject(err)
			cache[key] = result
			resolve(result)
		})
	} else {
		resolve(cache[key])
	}
})

module.exports.validateCert = (filename, pass) => {
	return module.exports.retrieveCert(filename, pass).then(a => {
		return {filename}
	}).catch(err => {
        module.exports.deleteCert(filename)
		return Promise.reject(false)
	})
}