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