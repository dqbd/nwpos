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

module.exports.retrieveCert = (filename, pass) => new Promise((resolve, reject) => {
	let file = fs.readFileSync(path.resolve(__dirname, "..", "data", "certs", filename))

	pem.readPkcs12(file, {p12Password: pass}, (err, result) => {
		if (err) {
			return reject(err)
		}
		resolve(result)
	})
})



module.exports.upload = (options, total) => new Promise((resolve, reject) => {
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

module.exports.retrieveCert("CZ1212121218.p12", "eet")
.then(result => {
	let options = {
		privateKey: result.key,
		certificate: result.cert,
		dic: "CZ1212121218",
		idPokl: randomString(20),
		idProvoz: "273",
		playground: true
	}

	return module.exports.upload(options, 3000)
}).then(response => {
	console.log(response)
})
