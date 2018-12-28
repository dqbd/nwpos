let services = require("./actionTypes")

const initialState = {
	print: false,
	eet: null,
	log: false,
	working: false,
	eans: false,
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
				working: false,
				eans: false,
			})
		case services.LOG:
			return Object.assign({}, state, {
				log: action.log
			})
		case services.STATUS:
			return Object.assign({}, state, {
				working: action.status
			})
		case services.SUBTRACT_EANS:
			return Object.assign({}, state, {
				eans: action.eans,
			})
	}

	return state
}