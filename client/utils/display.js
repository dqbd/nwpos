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
		let { COMMIT_BEGIN, COMMIT_TYPING, COMMIT_END, STAGE_TYPING } = customer.types.STATUS_TYPES
		if ([COMMIT_BEGIN, COMMIT_END].indexOf(newVal) >= 0 || 
			newVal === STAGE_TYPING && [COMMIT_BEGIN, COMMIT_TYPING, COMMIT_END].indexOf(oldVal) >= 0) {
			sendStream(newVal, loc)
		}
	}))
}
