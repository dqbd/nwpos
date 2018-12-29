const customer = require("../customer")
const suggestions = require("../suggestions")
const stats = require("../stats")
const clonedeep = require('lodash.clonedeep')

let seller = require("./actionTypes")

const initialState = {
	sellers: [],
	debug: false,
	inactive: [],
	current: 0,
	customer: undefined,
	nativePrinter: null,
	listenToScanner: false,
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
	let {inactive, current, customer: currentCustomer} = state

	switch (action.type) {
		case seller.ADDTAB:
			inactive = [...inactive.slice(0, current), clonedeep(currentCustomer), ...inactive.slice(current)]
			current = inactive.length
			currentCustomer = undefined
			break
		case seller.SWITCHTAB:
			if (current !== action.index && action.index < inactive.length + 1 && action.index >= 0) {
				let oldCustomer = currentCustomer
				let old = current

				currentCustomer = action.index > old ? inactive[action.index - 1] : inactive[action.index] 
				current = action.index
				inactive = Array.from(Array(inactive.length + 1).keys()).filter(i => i !== current).map(index => {
					if (index < old) {
						return inactive[index]
					} else if (index === old) {
						return oldCustomer
					} else if (index > old) {
						return inactive[index - 1]
					}
				}) 
			}
			break
		case seller.DELETETAB:
			if (action.index < current) {
				current = current - 1
				inactive = inactive.filter((item, index) => index !== action.index)
			} else if (action.index === current && inactive.length > 0) {
				current = (action.index >= inactive.length) ? current - 1 : current
				currentCustomer = inactive[current]
				inactive = inactive.filter((item, index) => index !== current)

			} else if (action.index > current && action.index < inactive.length + 1) {
				inactive = inactive.filter((item, index) => index + 1 !== action.index)
			}

			break
		case seller.CLOSETABS:
			inactive = []
			current = 0
			break
	}

	currentCustomer = customer.reducer(currentCustomer, action)

	return { inactive, current, customer: currentCustomer }
}

const nativePrinter = (state = null, action) => {
	if (action.type === seller.NATIVE_PRINTER) {
		return action.status
	}
	return state
}

const listenToScanner = (state = false, action) => {
	if (action.type === seller.LISTEN_SCANNER) {
		return action.listenToScanner
	}
	return state
}

module.exports = (state = initialState, action) => {
	return Object.assign({
		sellers: sellers(state.sellers, action),
		debug: debug(state.debug, action),
		suggestions: suggestions.reducer(state.suggestions, action),
		stats: stats.reducer(state.stats, action),
		nativePrinter: nativePrinter(state.nativePrinter, action),
		listenToScanner: listenToScanner(state.listenToScanner, action),
	}, switcher(state, action))
}