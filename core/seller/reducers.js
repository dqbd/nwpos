const customer = require("../customer")
const suggestions = require("../suggestions")
const stats = require("../stats")

let seller = require("./actionTypes")

const initialState = {
	info: undefined,
	eet: undefined,
	customer: undefined,
	suggestions: undefined,
	stats: undefined
}

const info = (state = "", action) => {
	if (action.type === seller.SETINFO) {
		return action.info
	}
	return state
}

module.exports = (state = initialState, action) => {
	return {
		info: info(state.info, action),
		customer: customer.reducer(state.customer, action),
		suggestions: suggestions.reducer(state.suggestions, action),
		stats: stats.reducer(state.stats, action)
	}
}