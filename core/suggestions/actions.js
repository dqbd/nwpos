const types = require("./actionTypes")
const fetch = require("isomorphic-fetch")

const getUrl = (endpoint) => {
	return process.env.BROWSER ? endpoint : "http://localhost" + endpoint
}

module.exports.reset = () => {
	return { type: types.SUGGEST, suggestions: [] }
}

module.exports.suggest = (price) => (dispatch) => {
	return fetch(getUrl(`/suggest`), {
		method: "POST",
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ price: price })
	})	
	.then(a => a.json())
	.then(a => {
		dispatch({ type: types.SUGGEST, suggestions: a })
	}).catch(e => {
		console.error(e)
	})
}

module.exports.listSuggestions = () => (dispatch) => {

	return fetch(getUrl("/suggest"), { method: "GET" })
	.then(a => a.json())
	.then(a => {
		dispatch({ type: types.SETLIST, grouped: a})
	}).catch(e => {
		console.error(e)
	})
}