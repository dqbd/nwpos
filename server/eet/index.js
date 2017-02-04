const path = require("path")
const fs = require("fs")

const eet = require("eet")
const pem = require("pem")
const uuid = require("node-uuid")

const randomString = (length) => {
	let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,:;#-_/"
	let payload = ""
	for(let i = 0; i < length; i++) {
		payload += letters.charAt(Math.floor(Math.random() * letters.length))
	}
	return payload
}

const getCertFile = (filename) => {
	return path.resolve(__dirname, "..", "data", filename)
}

const retrieveCert = (filename, pass) => new Promise((resolve, reject) => {
	let file = fs.readFileSync(getCertFile(filename))

	pem.readPkcs12(file, {p12Password: pass}, (err, result) => {
		if (err) {
			return reject(err)
		}
		resolve(result)
	})
})

const validateCert = (filename, pass) => {
	return retrieveCert(filename, pass).then(a => {
		return {filename}
	}).catch(err => {
		//delete file
		console.log("Cert not valid", err)
		fs.unlinkSync(getCertFile(filename))
		return Promise.reject(false)
	})
}

const upload = (options, total) => new Promise((resolve, reject) => {
	let { dic, idPokl, idProvoz } = options
	let gen = {
		poradCis: randomString(20),
		datTrzby: new Date()
	}

	const items = {
		dicPopl: dic,
		idPokl: idPokl,
		poradCis: gen.poradCis,
		datTrzby: gen.datTrzby,
		celkTrzba: total,
		idProvoz: idProvoz
	}

	eet(options, items).then(response => {
		resolve(Object.assign(response, gen))
	}, err => {
		reject(err)
	})
})

module.exports.retrieveCert = retrieveCert
module.exports.validateCert = validateCert
module.exports.upload = upload