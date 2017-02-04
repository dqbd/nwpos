const types = require("./actionTypes")

const suggestions = require("../suggestions/actionTypes")
const fetch = require("isomorphic-fetch")
const { getUrl } = require("../utils")

module.exports.reset = () => {
	return { type: types.RESET }
}

module.exports.eet = (total) => (dispatch) => {
	return fetch(getUrl("/eet"), {
		method: "POST",
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ total })
	})
	.then(a => {
		if (!a.ok) return Promise.reject("Failed sending EET")
		return a.json()
	}).then(eet => {
		dispatch({ type: types.EET, eet })
	})
}

module.exports.printCart = (customer) => (dispatch) => {
	return fetch(getUrl(`/print`), {
		method: "POST",
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ customer })
	})
	.then(res => {
		dispatch({ type: types.PRINT, print: res.ok })
	})
}

module.exports.log = (customer) => (dispatch) => {
	let payload = {
		returned: customer.screen,
		paid: customer.paid,
		cart: customer.cart
	}

	return fetch(getUrl(`/store`), {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ customer: payload })
	})
	.then(a => a.json())
	.then(a => {
		dispatch({ type: types.LOG, log: true })
		dispatch({ type: suggestions.SETLIST, grouped: a })
	}).catch(e => {
		console.error(e)
		dispatch({ type: types.LOG, log: false })
	})
}