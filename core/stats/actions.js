const stats = require("./actionTypes")
const { get } = require("../utils")

const setList = (list) => {
	return { type: stats.SETLIST, list }
}

const setDay = (day) => {
	return { type: stats.SETDAY, day }
}

module.exports.retrieveDay = (day) => (dispatch) => {
	return get("/logs?day=" + day)
		.then(res => {
			dispatch(setDay(res.data))
		})
}

module.exports.retrieve = () => (dispatch) => {
	return get("/loglist").then(a => dispatch(setList(a.data)))
}