const fetch = require("isomorphic-fetch")

module.exports.capitalize = (input) => {
	return input.charAt(0).toUpperCase() + input.slice(1)
}

module.exports.getUrl = (endpoint) => {
	return process.env.BROWSER ? endpoint : "http://localhost" + endpoint
}

module.exports.get = (url, body) => {

	let options = { method: "GET" }
	if (body) {
		if (body instanceof FormData) {
			options = {method: "POST", body}
		} else {
			options = {method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body)}
		}
	}

	return fetch(module.exports.getUrl(url), options).then(a => a.json().then(json => {
		return {ok: a.ok, data: json}
	}))
}