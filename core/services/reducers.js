let services = require("./actionTypes")

const initialState = {
	print: false,
	eet: null,
	log: false,
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
				log: false
			})
		case services.LOG:
			return Object.assign({}, state, {
				log: action.log
			})
	}

	return state
}