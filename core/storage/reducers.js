const stats = require("./actionTypes")

const initialState = {
	items: [],
}

module.exports = (state = initialState, action) =>{
	if (action.type === stats.SETITEMS) {
		return Object.assign({}, state, { items: action.items })
	}

	return state
}