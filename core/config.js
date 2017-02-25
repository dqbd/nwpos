const { get } = require("./utils")

module.exports.get = () => {
	return get("/config").then(res => res.data.config)
}

module.exports.set = (config) => {
	return get("/config", { config }).then(res => res.data.config)
}	

module.exports.validateKey = (buffer, pass) => {
	let data = new FormData()
	let blob = new Blob([buffer], { type: "application/x-pkcs12" })
	data.append("p12", blob)
	data.append("pass", pass)

	return get("/p12", data).then(res => {
		if (!res.ok) return Promise.reject(res)
		return res.data
	})
}