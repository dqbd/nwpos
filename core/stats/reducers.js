const stats = require("./actionTypes")

const initialState = {
	list: [],
	day: undefined
}

module.exports = (state = initialState, action) =>{
	if (action.type === stats.SETLIST) {
		return Object.assign({}, state, { list: action.list })
	} else if (action.type === stats.SETDAY) {
		return Object.assign({}, state, { day: action.day })
	}

	return state
}