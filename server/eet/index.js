const eet = require("eet")
const certs = require("./certs")
const req = require("request")

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

module.exports.upload = (seller, total, poradCis, datTrzby, startTime = 0) => certs.retrieveCert(seller.eet.file, seller.eet.pass).then(result => {
	poradCis = (poradCis !== undefined) ? poradCis : generatePoradCislo()
	datTrzby = (datTrzby !== undefined) ? datTrzby : new Date()
	overeni = (seller.eet.overeni !== undefined) ? seller.eet.overeni : false  

	let timings = {startEet: startTime, certRetrieved: new Date().getTime() - startTime}

	const options = {
		playground: seller.eet.playground,
		offline: seller.eet.offline,
		privateKey: result.key,
		timeout: 3500,
		certificate: result.cert,
		startTime,
		request: (options, callback) => {
			options.time = true
			return req(options, (err, res, body) => {
				timings = Object.assign(timings, res.timings)
				callback(err, res, body)
			})
		} 
	}

	const items = {
		overeni: overeni,
		dicPopl: seller.dic,
		idPokl: seller.eet.idPokl,
		idProvoz: seller.eet.idProvoz,
		poradCis: poradCis,
		datTrzby: datTrzby,
		celkTrzba: total
	}

	return eet(options, items).then(response => {
		if (response.err && response.err instanceof Error) {
			let newError = {}
			Object.getOwnPropertyNames(response.err).forEach((key) => {
				newError[key] = response.err[key]
			})
			response.err = newError
			response.overeni = overeni
		}

		response.timings = timings
		response.timings.sendFinished = new Date().getTime() - startTime

		return Object.assign(response, {poradCis, datTrzby})
	}, err => {
		console.log(err)
		return Promise.reject(err)
	})
}) 

module.exports.certs = certs