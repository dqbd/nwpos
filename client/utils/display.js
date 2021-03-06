const deepEqual = require("deep-equal")
const watch = require("redux-watch")

const { customer } = require("../../core")
const { get } = require("../../core/utils")

let throttle = null
let cache = {} 

function sendStream(newVal, loc) {
	let payload = {}
	payload[loc.replace("customer.", "")] = newVal

	cache = Object.assign(cache, payload)

	clearTimeout(throttle)
	throttle = setTimeout(() => {
		get("/stream", {customer: cache})
		cache = {}
	}, 25)
}

module.exports.bindDisplayEvents = (store) => {
	// reset state when loading app
	sendStream(store.getState().customer.cart, 'customer.cart')
	sendStream(store.getState().customer.paid, 'customer.paid')
	sendStream(store.getState().customer.status, 'customer.status')

	store.subscribe(watch(store.getState, "customer.cart", deepEqual)((newVal, oldVal, loc) => sendStream(newVal, loc)))
	store.subscribe(watch(store.getState, "customer.paid")((newVal, oldVal, loc) => sendStream(newVal, loc)))
	store.subscribe(watch(store.getState, "customer.status")((newVal, oldVal, loc) => {
		let { COMMIT_END } = customer.types.STATUS_TYPES
		let isEnd = (val) => val === COMMIT_END
		if (isEnd(oldVal) !== isEnd(newVal)) {
			sendStream(newVal, loc)
		}
	}))
}
