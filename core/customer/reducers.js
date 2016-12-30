const cart = require("../cart")
const screen = require("../screen")
const services = require("../services")

const customer = require("./actionTypes")
const statusTypes = customer.STATUS_TYPES 

let initialState = {
	status: statusTypes.STAGE_TYPING,
	paid: 0,
	cart: undefined,
	screen: undefined,
	services: undefined
}

const status = (state = statusTypes.STAGE_TYPING, action) => {
	if (action.type === customer.SETSTATUS) {
		return action.status
	}
	return state
}

const paid = (state = 0, action) => {
	if (action.type === customer.SETPAID) {
		return action.paid
	}
	return state
}

module.exports = (state = initialState, action) => {
	return {
		status: status(state.status, action),
		paid: paid(state.paid, action),
		cart: cart.reducer(state.cart, action),
		screen: screen.reducer(state.screen, action),
		services: services.reducer(state.services, action)
	}
}