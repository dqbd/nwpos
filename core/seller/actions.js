let actionTypes = require("./actionTypes")
const { get } = require("../utils")

module.exports.retrieveSellers = () => (dispatch) => {
	return get("/sellers")
		.then(res => {
			dispatch({ type: actionTypes.SETSELLERS, sellers: res.data.sellers })
		})
}

module.exports.retrieveDebug = () => (dispatch) => {
	console.log("retrieving debug")
	return get("/debug")
		.then(res => {
			dispatch({ type: actionTypes.SETDEBUG, debug: res.data.debug })
		})
}