const eet = require("eet")
const certs = require("./certs")

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

module.exports.upload = (seller, total, poradCis, datTrzby) => certs.retrieveCert(seller.eet.file, seller.eet.pass).then(result => {
	let options = Object.assign({}, seller.eet, { privateKey: result.key, certificate: result.cert, dic: seller.dic })
	let { dic, idPokl, idProvoz } = options

	poradCis = (poradCis !== undefined) ? poradCis : generatePoradCislo()
	datTrzby = (datTrzby !== undefined) ? datTrzby : new Date()

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

module.exports.certs = certs