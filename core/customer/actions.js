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
			if (name !== lastItem.name && name !== undefined) {
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

	if (cart.getTotal(newCart) !== 0) {
		dispatch(screen.set(cart.getTotal(newCart)))
		dispatch({ type: types.SETPAID, paid: 0 })
		dispatch({ type: types.SETSTATUS, status: statusTypes.COMMIT_BEGIN })
	}
}

/**
 * Customer has paid
 * Open drawer when ready
 * 
 * Subtract all necessary EANs in the storage
 */
module.exports.pay = () => (dispatch, getState) => {
	let { newCart, newScreen, newStatus } = wrapState(getState())
	let screenValue = screen.getValue(newScreen)

	if (cart.getTotal(newCart) !== 0) {
		if (screenValue === 0 || newStatus === statusTypes.STAGE_ADDED) {
			dispatch(screen.set(cart.getTotal(newCart)))
			dispatch({ type: types.SETPAID, paid: 0 })
			dispatch({ type: types.SETSTATUS, status: statusTypes.COMMIT_BEGIN })
		} else {
			// open drawer
			dispatch(services.drawer())
			// subtract necessary EANs in the storage
			dispatch(services.subtractEans(cart.getEansFromCart(newCart)))
			dispatch(screen.set(cart.getTotal(newCart) - newScreen))
			dispatch({ type: types.SETPAID, paid: newScreen })
			dispatch({ type: types.SETSTATUS, status: statusTypes.COMMIT_END })
		}
	}
}

module.exports.edit = () => (dispatch) => {
	dispatch(screen.clear())
	dispatch({ type: types.SETPAID, paid: 0 })
	dispatch({ type: types.SETSTATUS, status: statusTypes.STAGE_TYPING })
}

/** 
 * Prints a customer
 * 1) log in EET
 * 2) print
 * 3) log into our DB 
**/
module.exports.print = (nativePrint, hasNativePrinter) => (dispatch, getState) => {
	// TODO: eet offline
	let { newServices, newCart, newCustomer } = wrapState(getState())

	let timeout = setTimeout(() => dispatch(services.working(true)), 100)

	Promise.resolve(newServices.eet)
		.then(eet => {
			//prevent resending
			let total = cart.getTotal(newCart)
			let ic = getState().customer.seller
			if (!eet) return dispatch(services.eet(total, ic)).catch(a => false)
			return eet 
		})
		.then(eet => dispatch(services.printCart(getState().customer, nativePrint, hasNativePrinter)))
		.then(print => {
			let { newServices } = wrapState(getState())

			if (!newServices.log) {
				dispatch(services.log(getState().customer))
			}

			clearTimeout(timeout)
			dispatch(services.working(false))
		})
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

module.exports.suggest = () => (dispatch, getState) => {
	let { newScreen, newStatus } = wrapState(getState())

	if ( [statusTypes.STAGE_ADDED, statusTypes.STAGE_TYPING].indexOf(newStatus) >= 0 ) {
		dispatch(suggestions.suggest(screen.getValue(newScreen)))
	}
}

module.exports.seller = (ic) => {
	return { type: types.SETSELLER, ic }
}


module.exports.addEan = ({ ean, name, price }) => (dispatch, getState) => {
	// when adding item after commit
	if (getState().status === statusTypes.COMMIT_END) {
		dispatch(module.exports.clear())
	}

	let { newCart, newStatus } = wrapState(getState())

	// TODO: consider, whether we should search the entire cart for ean (might be confusing with basic adding)
	let lastItem = newCart.items.slice(-1)[0]
	const newName = `${capitalize(name)} ${ean}`

	const isLastItemSame = !!lastItem && lastItem.price === price && lastItem.name === newName && lastItem.ean === ean
	
	if (isLastItemSame) {
		dispatch(cart.addQty(1, newCart.items.length - 1))
	} else {
		dispatch(cart.addItem(price, newName, 1, ean))
	}
	
	const isInEditing = [statusTypes.STAGE_TYPING, statusTypes.STAGE_ADDED].indexOf(newStatus) >= 0
	if (isInEditing) {
		dispatch(screen.set(price))
		dispatch({ type: types.SETSTATUS, status: statusTypes.STAGE_ADDED })
	}
}

module.exports.discount = () => (dispatch, getState) => {
	let { newStatus, newScreen } = wrapState(getState())

	if (newStatus === statusTypes.STAGE_ADDED) {
		dispatch(cart.invertQty())
	} else if (newScreen !== 0) {
		dispatch(screen.toggleNegative())
		dispatch(module.exports.add())
		dispatch(cart.renameItem("Sleva"))
		dispatch(screen.toggleNegative())
	}
}