const stats = require("./actionTypes")
const { get } = require("../utils")

const setList = (list) => {
	return { type: stats.SETLIST, list }
}

const setDay = (day) => {
	return { type: stats.SETDAY, day }
}

const setSummary = (summary) =>{
	return { type: stats.SETSUMMARY, summary }
}

module.exports.retrieveSummary = () => (dispatch) => {
	return get("/logsummary").then(a => dispatch(setSummary(a.data)))
}

module.exports.retrieveDay = (day) => (dispatch) => {
	if (!day) return Promise.resolve().then(() => {
		dispatch(module.exports.retrieveSummary())
		dispatch(setDay(undefined))
	})

	return get("/logs?day=" + day)
		.then(res => {
			dispatch(setDay(res.data))
		})
}

module.exports.retrieve = () => (dispatch) => {
	return get("/loglist").then(a => dispatch(setList(a.data)))
}