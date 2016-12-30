let suggestions = require("./actionTypes")

const initialState = {
	all: {},
	contextual: []
}

module.exports = (state = initialState, action) => {
	switch(action.type) {
		case suggestions.SUGGEST:
			return Object.assign({}, state, {
				contextual: action.suggestions
			})
		case suggestions.SETLIST:
			return Object.assign({}, state, {
				all: action.grouped
			})
	}

	return state
}