const types = require("./actionTypes")
const fetch = require("isomorphic-fetch")
const { getUrl } = require("../utils")

module.exports.reset = () => {
	return { type: types.SUGGEST, suggestions: [] }
}

module.exports.suggest = (price) => (dispatch, getState) => {
	let state = getState()
	let suggestions = (state.suggestions) ? state.suggestions.all : state.all

	if (price === 0) {
		dispatch({ type: types.SUGGEST, suggestions: [] })
	} else {
		let flatten = Object.keys(suggestions).reduce((memo, key) => [...memo, ...suggestions[key]], [])

		let sorted = flatten.sort((a, b) => {
			let avg_a = a.total / a.bought
			let avg_b = b.total / b.bought
			return Math.abs(avg_a - price) - Math.abs(avg_b - price)
		}).map(a => a.name)

		dispatch({ type: types.SUGGEST, suggestions: sorted })
	}
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