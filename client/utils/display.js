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
	store.subscribe(watch(store.getState, "customer.cart", deepEqual)((newVal, oldVal, loc) => sendStream(newVal, loc)))
	store.subscribe(watch(store.getState, "customer.paid")((newVal, oldVal, loc) => sendStream(newVal, loc)))
	store.subscribe(watch(store.getState, "customer.status")((newVal, oldVal, loc) => {
		let { COMMIT_BEGIN } = customer.types.STATUS_TYPES
		let isEnd = (val) => val === COMMIT_END ? 1 : 0 
		if (isEnd(oldVal) !== isEnd(newVal)) {
			sendStream(newVal, loc)
		}
	}))
}
