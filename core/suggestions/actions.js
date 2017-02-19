const types = require("./actionTypes")
const fetch = require("isomorphic-fetch")
const { getUrl } = require("../utils")

module.exports.reset = () => {
	return { type: "" }
}

module.exports.suggest = (price) => (dispatch, getState) => {
	let state = getState()
	let suggestions = (state.suggestions) ? state.suggestions.contextual : state.contextual

	if (price !== 0) {
		let sorted = suggestions.sort((a, b) => {
			let avg_a = a.total / a.bought
			let avg_b = b.total / b.bought
			return Math.abs(avg_a - price) - Math.abs(avg_b - price)
		})

		dispatch({ type: types.SUGGEST, suggestions: sorted })
	}
}

module.exports.setSuggestions = (grouped) => (dispatch) => {
	dispatch({ type: types.SETLIST, grouped })
	dispatch({ type: types.SUGGEST, suggestions: Object.keys(grouped).reduce((memo, key) => [...memo, ...grouped[key]], []) })
}

module.exports.listSuggestions = () => (dispatch) => {
	return fetch(getUrl("/suggest"), { method: "GET" })
	.then(a => a.json())
	.then(a => {
		dispatch(module.exports.setSuggestions(a))
	}).catch(e => {
		console.error(e)
	})
}