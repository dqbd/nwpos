let services = require("./actionTypes")

const initialState = {
	print: false,
	eet: null,
	log: false,
	nativePrinter: null,
	working: false
}

module.exports = (state = initialState, action) => {
	switch(action.type) {
		case services.PRINT:
			return Object.assign({}, state, {
				print: action.print
			})
		case services.EET:
			return Object.assign({}, state, {
				eet: action.eet
			})
		case services.RESET:
			return Object.assign({}, state, {
				print: false,
				eet: null,
				log: false,
				working: false
			})
		case services.LOG:
			return Object.assign({}, state, {
				log: action.log
			})
		case services.STATUS:
			return Object.assign({}, state, {
				working: action.status
			})
		case services.NATIVE_PRINTER:
			return Object.assign({}, state, {
				nativePrinter: action.status,
			})
	}

	return state
}