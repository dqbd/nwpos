let actionTypes = require("./actionTypes")

module.exports.setInfo = (info) => {
	return { type: actionTypes.SETINFO, info }
}

module.exports.setEet = (eet) => {
	return { type: actionTypes.SETEET, eet }
}

