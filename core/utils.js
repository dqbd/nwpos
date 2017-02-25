const fetch = require("isomorphic-fetch")
const socket = require('socket.io-client')("http://"+window.location.host)

let connected = false
socket.on('connect', () => {
	console.log("Connected", socket.id)
})

socket.on("error", (err) => {
	console.log("Disconnected", err)
})

module.exports.capitalize = (input) => {
	return input.charAt(0).toUpperCase() + input.slice(1)
}

module.exports.getUrl = (endpoint) => {
	return process.env.BROWSER ? endpoint : "http://localhost" + endpoint
}

module.exports.get = (url, body) => {
	let method = body ? "POST" : "GET"

	if (!(body instanceof FormData)) {
		return new Promise((resolve, reject) => {
			if (url.indexOf("?") >= 0) {
				let parsed = url.split("?")
				url = parsed[0]
				body = parsed[1].split("&").reduce((body, item) => {
					item = item.split("=")
					body[item[0]] = item[1]
					return body
				}, {})
			}

			console.log("Emitting", method + url, body)
			socket.emit(method + url, body, (res) => {
				resolve(res)
			})
		})
	}

	let options = { method }
	if (body) {
		if (body instanceof FormData) {
			options = {method, body}
		} else {
			options = {method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body)}
		}
	}

	return fetch(module.exports.getUrl(url), options).then(a => a.json().then(json => {
		return {ok: a.ok, data: json}
	}))
}