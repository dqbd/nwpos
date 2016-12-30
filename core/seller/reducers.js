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

const infoState = {
	name: "",
	ic: "",
	dic: "",
	street: "",
	psc: "",
	city: "",
}

const eetState = {
	idProvoz: "",
	idPokl: "",
	cert: "",
	pass: ""
}


const info = (state = infoState, action) => {
	if (action.type === seller.SETINFO) {
		return Object.assign({}, state, action.info)
	}
	return state
}

const eet = (state = eetState, action) => {
	if (action.type === seller.SETEET) {
		return Object.assign({}, state, action.eet)
	}
	return state
}

module.exports = (state = initialState, action) => {
	return {
		info: info(state.info, action),
		eet: eet(state.eet, action),
		customer: customer.reducer(state.customer, action),
		suggestions: suggestions.reducer(state.suggestions, action),
		stats: stats.reducer(state.stats, action)
	}
}