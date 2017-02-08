const fetch = require("isomorphic-fetch")
const { getUrl } = require("./utils")

module.exports.get = () => {
	return fetch(getUrl("/config"), { method: "GET" }).then(a => a.json())
		.then(data => data.config)
}

module.exports.set = (config) => {
	return fetch(getUrl("/config"), {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ config: config })
	}).then(a => a.json()).then(data => data.config)
}	

module.exports.validateKey = (buffer, pass) => {
	let data = new FormData()
	let blob = new Blob([buffer], { type: "application/x-pkcs12" })
	data.append("p12", blob)
	data.append("pass", pass)

	return fetch(getUrl("/p12"), {
		method: "POST",
		body: data
	}).then(a => a.json()).then(res => {
		if (!res) return Promise.reject(res)
		return res
	})
}