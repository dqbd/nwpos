const { capitalize } = require("../utils")

const screen = require("../screen")
const cart = require("../cart")
const services = require("../services")
const suggestions = require("../suggestions")

const types = require("./actionTypes")
const statusTypes = types.STATUS_TYPES 

const wrapState = (state) => {
	let wrapped = {}
	let items = (state.customer !== undefined) ? state.customer : state

	Object.keys(items).forEach(key => {
		wrapped["new" + capitalize(key)] = items[key]
	})

	return wrapped
}


module.exports.add = () => (dispatch, getState) => {
	let { newCart, newScreen, newStatus } = wrapState(getState())

	let lastItem = newCart.items.slice(-1)[0]
	let screenValue = screen.getValue(newScreen)

	if (screenValue != 0) {
		dispatch({ type: types.SETSTATUS, status: statusTypes.STAGE_ADDED })

		if (newStatus === statusTypes.STAGE_ADDED && lastItem !== undefined && lastItem.price === screenValue) {
			dispatch(cart.addQty(1, newCart.items.length - 1))
		} else {
			dispatch(cart.addItem(screenValue))
		}
	}
}

module.exports.checkout = () => (dispatch, getState) => {
	let { newCart } = wrapState(getState())
	
	dispatch(screen.set(cart.getTotal(newCart)))
	dispatch({ type: types.SETPAID, paid: 0 })
	dispatch({ type: types.SETSTATUS, status: statusTypes.COMMIT_BEGIN })
}

module.exports.pay = () => (dispatch, getState) => {
	let { newCart, newScreen } = wrapState(getState())

	dispatch(screen.set(cart.getTotal(newCart) - newScreen))
	dispatch({ type: types.SETPAID, paid: newScreen })
	dispatch({ type: types.SETSTATUS, status: statusTypes.COMMIT_END })
}

module.exports.edit = () => (dispatch) => {
	dispatch(screen.clear())
	dispatch({ type: types.SETPAID, paid: 0 })
	dispatch({ type: types.SETSTATUS, status: statusTypes.STAGE_TYPING })
}

module.exports.print = () => (dispatch, getState) => {
	dispatch(services.printCart(getState().customer))
}

module.exports.qty = () => (dispatch, getState) => {
	let { newCart, newScreen } = wrapState(getState())

	dispatch(cart.setQty(screen.getValue(newScreen)))
	dispatch(screen.set(screen.getValue(newCart.items[newCart.selection].price)))
	dispatch({ type: types.SETSTATUS, status: statusTypes.STAGE_ADDED })
}

module.exports.clear = () => (dispatch) => {
	dispatch(screen.clear())
	dispatch(cart.clear())
	dispatch(services.reset())
	dispatch({ type: types.SETPAID, paid: 0 })
	dispatch({ type: types.SETSTATUS, status: statusTypes.STAGE_TYPING })
}

module.exports.log = () => (dispatch, getState) => {
	dispatch(services.log(getState().customer))
}

module.exports.suggest = () => (dispatch, getState) => {
	let { newScreen } = wrapState(getState())
	dispatch(suggestions.suggest(screen.getValue(newScreen)))
}

