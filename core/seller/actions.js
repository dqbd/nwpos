let actionTypes = require("./actionTypes")

const fetch = require("isomorphic-fetch")
const { getUrl } = require("../utils")

module.exports.retrieveSellers = () => (dispatch) => {
	return fetch(getUrl("/sellers"))
		.then(data => data.json())
		.then(data => {
			dispatch({ type: actionTypes.SETSELLERS, sellers: data.sellers })
		})
}

module.exports.retrieveDebug = () => (dispatch) => {
	console.log("retrieving debug")
	return fetch(getUrl("/debug"))
		.then(data => data.json())
		.then(data => {
			dispatch({ type: actionTypes.SETDEBUG, debug: data.debug })
		})
}