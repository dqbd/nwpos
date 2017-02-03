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


module.exports.add = (name) => (dispatch, getState) => {
	let { newCart, newScreen, newStatus } = wrapState(getState())

	let lastItem = newCart.items.slice(-1)[0]
	let screenValue = screen.getValue(newScreen)

	if (screenValue != 0) {
		dispatch({ type: types.SETSTATUS, status: statusTypes.STAGE_ADDED })

		if (newStatus === statusTypes.STAGE_ADDED && lastItem !== undefined && lastItem.price === screenValue) {
			if (name !== lastItem.name && name !== undefined && name.trim().length > -1) {
				dispatch(cart.renameItem(name))
			} else { 
				dispatch(cart.addQty(1, newCart.items.length - 1))
			}
		} else {
			dispatch(cart.addItem(screenValue))
			if (name !== undefined && name.trim().length > 0) {
				dispatch(cart.renameItem(name))
			}
		}
	}

}

// TODO: decide if use to purely just add items or rename
module.exports.rename = (name) => (dispatch, getState) => {
	let { newCart, newScreen, newStatus } = wrapState(getState())
	let last = newCart.items.length - 1
	let lastItem = newCart.items.slice(-1)[0]
	let screenValue = screen.getValue(newScreen)

	//increment
	if (newStatus === statusTypes.STAGE_ADDED && newCart.selection == last && lastItem !== undefined && lastItem.price === screenValue && lastItem.name === name) {
		dispatch(cart.addQty(1, last))
	} else {
		//add	
		if ( newStatus === statusTypes.STAGE_TYPING && newCart.selection == last && screenValue != 0) {
			dispatch({ type: types.SETSTATUS, status: statusTypes.STAGE_ADDED })
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
	let { newCart, newScreen, newStatus } = wrapState(getState())
	let screenValue = screen.getValue(newScreen)

	if (screenValue === 0 || newStatus === statusTypes.STAGE_ADDED) {
		dispatch(screen.set(cart.getTotal(newCart)))
		dispatch({ type: types.SETPAID, paid: 0 })
		dispatch({ type: types.SETSTATUS, status: statusTypes.COMMIT_BEGIN })
	} else {
		dispatch(screen.set(cart.getTotal(newCart) - newScreen))
		dispatch({ type: types.SETPAID, paid: newScreen })
		dispatch({ type: types.SETSTATUS, status: statusTypes.COMMIT_END })
	}
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
	dispatch(suggestions.reset())
	dispatch({ type: types.SETPAID, paid: 0 })
	dispatch({ type: types.SETSTATUS, status: statusTypes.STAGE_TYPING })
}

module.exports.log = () => (dispatch, getState) => {
	dispatch(services.log(getState().customer))
}

module.exports.suggest = () => (dispatch, getState) => {
	let { newScreen, newStatus } = wrapState(getState())

	if ( [statusTypes.STAGE_ADDED, statusTypes.STAGE_TYPING].indexOf(newStatus) >= 0 ) {
		dispatch(suggestions.suggest(screen.getValue(newScreen)))
	}
}