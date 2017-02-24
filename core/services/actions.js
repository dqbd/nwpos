const types = require("./actionTypes")

const suggestions = require("../suggestions/actions")
const fetch = require("isomorphic-fetch")
const { getUrl } = require("../utils")

module.exports.reset = () => {
	return { type: types.RESET }
}

module.exports.eet = (total, ic) => (dispatch) => {
	return fetch(getUrl("/eet"), {
		method: "POST",
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ total, ic })
	})
	.then(a => {
		if (!a.ok) return Promise.reject("Failed sending EET")
		return a.json()
	}).then(eet => {
		dispatch({ type: types.EET, eet })
	})
}

module.exports.drawer = () => (dispatch) => {
	return fetch(getUrl("/drawer"))
	.then(a => {
		if (!a.ok) return Promise.reject("Failed opening drawer")
		return a.json()
	})
}

module.exports.printCart = (customer, nativePrint) => (dispatch) => {
	return fetch(getUrl(`/print`), {
		method: "POST",
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ customer })
	})
	.then(res => {
		dispatch({ type: types.PRINT, print: res.ok })
		if (res.status !== 200) return res.json()
	}).then(data => {
		if (data && data.buffer && nativePrint) {
			nativePrint(data.buffer)
		}
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

	return fetch(getUrl(`/store`), {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ customer: payload })
	})
	.then(a => a.json())
	.then(a => {
		dispatch({ type: types.LOG, log: true })
		dispatch(suggestions.setSuggestions(a))
	}).catch(e => {
		console.error(e)
		dispatch({ type: types.LOG, log: false })
	})
}