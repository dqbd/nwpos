let actionTypes = require("./actionTypes")
let wrapped = {}

wrapped.addDigit = (digit) => {
	if (typeof digit === "string") {
		digit = Number.parseInt(digit)
	}

	return ({ type: actionTypes.ADD_DIGIT, digit })
}

wrapped.enableDecimal = () => {
	return ({ type: actionTypes.ENABLE_DECIMAL })
}

wrapped.removeDigit = () => {
	return ({ type: actionTypes.REMOVE_DIGIT })
}

wrapped.toggleNegative = () => {
	return ({ type: actionTypes.TOGGLE_NEGATIVE })
}

wrapped.clear = () => {
	return ({ type: actionTypes.CLEAR })
}

wrapped.set = (value) => {
	return ({ type: actionTypes.SET, value })
}

const types = require("../customer/actionTypes")
const cart = require("../cart/actions")
const services = require("../services/actions")
const suggestions = require("../suggestions/actions")
const statusTypes = types.STATUS_TYPES 

Object.keys(wrapped).forEach(key => {
	module.exports[key] = function () {
		let args = arguments
		return (dispatch, getState) => {
			let state = getState()

			if (typeof state === "object") {
				if (state.customer !== undefined) {
					state = state.customer
				}

				if (state.status === statusTypes.STAGE_ADDED) {
					dispatch({ type: types.SETSTATUS, status: statusTypes.STAGE_TYPING })
					dispatch(wrapped.clear())
				} else if (state.status === statusTypes.COMMIT_BEGIN) {
					dispatch({ type: types.SETSTATUS, status: statusTypes.COMMIT_TYPING })
					dispatch(wrapped.clear())
				} else if (state.status === statusTypes.COMMIT_END) {
					dispatch({ type: types.SETPAID, paid: 0 })
					dispatch({ type: types.SETSTATUS, status: statusTypes.STAGE_TYPING })
					dispatch(cart.clear())
					dispatch(wrapped.clear())
					dispatch(services.reset())
					dispatch(suggestions.reset())
				}
			}

			dispatch(wrapped[key].apply(this, arguments))
		}
	}
})