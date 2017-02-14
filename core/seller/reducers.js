const customer = require("../customer")
const suggestions = require("../suggestions")
const stats = require("../stats")

let seller = require("./actionTypes")

const initialState = {
	sellers: [],
	customer: undefined,
	suggestions: undefined,
	stats: undefined
}

const sellers = (state = [], action) => {
	if (action.type === seller.SETSELLERS) {
		return action.sellers
	}
	return state
}

module.exports = (state = initialState, action) => {
	return {
		sellers: sellers(state.sellers, action),
		customer: customer.reducer(state.customer, action),
		suggestions: suggestions.reducer(state.suggestions, action),
		stats: stats.reducer(state.stats, action)
	}
}