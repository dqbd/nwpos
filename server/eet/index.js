const path = require("path")
const fs = require("fs")

const eet = require("eet")
const pem = require("pem")
const uuid = require("node-uuid")

const generatePoradCislo = () => {
	let date = new Date()
	let payload = [
		date.getDate(),
		date.getMonth()+1,
		date.getFullYear(),
		date.getHours(),
		date.getMinutes(),
		date.getSeconds(),
		date.getMilliseconds()
	].join("")

	while (payload.length < 17) {
		payload = "0" + payload
	}
		
	return payload
}

const getCertFile = (filename) => {
	return path.resolve(__dirname, "..", "data", filename)
}

const retrieveCert = (filename, pass) => new Promise((resolve, reject) => {
	let file = fs.readFileSync(getCertFile(filename))
	pem.readPkcs12(file, {p12Password: pass}, (err, result) => {
		if (err) return reject(err)
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

const upload = (seller, total, poradCis, datTrzby) => retrieveCert(seller.eet.file, seller.eet.pass).then(result => {
	let options = Object.assign(seller.eet, { privateKey: result.key, certificate: result.cert, dic: seller.dic })
	let { dic, idPokl, idProvoz } = options

	poradCis = (poradCis) ? poradCis : generatePoradCislo
	datTrzby = (datTrzby) ? datTrzby : new Date()

	const items = {
		dicPopl: dic,
		idPokl: idPokl,
		poradCis: poradCis,
		datTrzby: datTrzby,
		celkTrzba: total,
		idProvoz: idProvoz
	}

	return eet(options, items).then(response => {
		return Object.assign(response, {poradCis, datTrzby})
	}, err => {
		console.log(err)
		return Promise.reject(err)
	})
}) 

module.exports.retrieveCert = retrieveCert
module.exports.validateCert = validateCert
module.exports.upload = upload