let services = require("./actionTypes")

const initialState = {
	print: false,
	eet: false,
	log: false,
}

module.exports = (state = initialState, action) => {
	switch(action.type) {
		case services.PRINT:
			return Object.assign({}, state, {
				print: true
			})
		case services.RESET:
			return Object.assign({}, state, {
				print: false,
				eet: false,
				log: false
			})
		case services.LOG:
			return Object.assign({}, state, {
				log: action.log
			})
	}

	return state
}