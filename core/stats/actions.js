const stats = require("./actionTypes")
const fetch = require("isomorphic-fetch")
const { getUrl } = require("../utils")

const setList = (list) => {
	return { type: stats.SETLIST, list }
}

const setDay = (day) => {
	return { type: stats.SETDAY, day }
}

module.exports.retrieveDay = (day) => (dispatch) => {
	return fetch(getUrl("/logs") + "?day=" + day).then(a => a.json())
		.then(day => {
			dispatch(setDay(day))
		})
}

module.exports.retrieve = () => (dispatch) => {
	return fetch(getUrl("/loglist")).then(a => a.json())
		.then(a => dispatch(setList(a)))
}