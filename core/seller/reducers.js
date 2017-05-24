const customer = require("../customer")
const suggestions = require("../suggestions")
const stats = require("../stats")

let seller = require("./actionTypes")

const initialState = {
	sellers: [],
	debug: false,
	current: 0,
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

const debug = (state = false, action) =>{
	if (action.type === seller.SETDEBUG) {
		return action.debug
	}
	return state
}

const switcher = (state = initialState, action) => {
	return {
		current: state.current,
		customer: customer.reducer(state.customer, action),
	}
}

module.exports = (state = initialState, action) => {
	return Object.assign({
		sellers: sellers(state.sellers, action),
		debug: debug(state.debug, action),
		suggestions: suggestions.reducer(state.suggestions, action),
		stats: stats.reducer(state.stats, action)
	}, switcher(state, action))
}