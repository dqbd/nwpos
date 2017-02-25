const fetch = require("isomorphic-fetch")

module.exports.capitalize = (input) => {
	return input.charAt(0).toUpperCase() + input.slice(1)
}

const getUrl = (endpoint) => {
	return process.env.BROWSER ? endpoint : "http://localhost" + endpoint
}

module.exports.get = (url, body) => {
	let method = body ? "POST" : "GET"
	let options = { method }
	if (body) {
		if (body instanceof FormData) {
			options = {method, body}
		} else {
			options = {method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body)}
		}
	}

	return fetch(getUrl(url), options).then(a => a.json().then(json => {
		return {ok: a.ok, data: json}
	}))
}