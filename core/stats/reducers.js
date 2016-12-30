const stats = require("./actionTypes")

module.exports = (state = [], action) =>{
	if (action.type === stats.SETLOGS) {
		return action.logs
	}

	return state
}