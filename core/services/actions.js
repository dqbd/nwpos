const types = require("./actionTypes")

const suggestions = require("../suggestions/actions")
const { get } = require("../utils")

module.exports.reset = () => {
	return { type: types.RESET }
}

module.exports.working = (status) => {
	return { type: types.STATUS, status }
}

module.exports.eet = (total, ic) => (dispatch) => {
	return get("/eet", { total, ic })
	.then(res => {
		if (!res.ok) return Promise.reject("Failed sending EET")
		dispatch({ type: types.EET, eet: res.data })
	})
}

module.exports.drawer = () => (dispatch) => {
	return get("/drawer")
	.then(res => {
		if (!res.ok) return Promise.reject("Failed opening drawer")
		return res.data
	})
}

module.exports.printCart = (customer, nativePrint, hasNativePrinter) => (dispatch) => {
	const native = (hasNativePrinter && hasNativePrinter() && nativePrint && true) || false

	return get('/print', { customer, native })
	.then(res => {
		dispatch({ type: types.PRINT, print: res.ok })
		if (res.status !== 200 && res.data && res.data.buffer && nativePrint) {
			nativePrint(res.data.buffer)
		}
	})
}

module.exports.subtractEans = (eans) => (dispatch) => {
	if (Object.keys(eans).length === 0) return Promise.resolve(true)
	return get('/qtyitems', { eans }).then(res => {
		dispatch({ type: types.SUBTRACT_EANS, eans: res.ok })
		if (!res.ok) return Promise.reject('Failed to subtract from storage')
		return res.data
	})
}

module.exports.log = (customer) => (dispatch) => {
	let payload = {
		returned: customer.screen,
		paid: customer.paid,
		cart: customer.cart,
		seller: customer.seller,
		services: customer.services
	}

	if (payload.services.eet !== null) {
		if (payload.services.eet.datTrzby) {
			payload.date = new Date(Date.parse(payload.services.eet.datTrzby))
		} else if (payload.services.eet.date) {
			payload.date = new Date(Date.parse(payload.services.eet.date))
		} 
	} 

	if (!payload.date) {
		payload.date = new Date()
	}

	return get('/store', { customer: payload })
	.then(a => {
		dispatch({ type: types.LOG, log: a.ok })
		dispatch(suggestions.setSuggestions(a.data))
	}).catch(e => {
		console.error(e)
		dispatch({ type: types.LOG, log: false })
	})
}
