const stats = require("./actionTypes")
const fetch = require("isomorphic-fetch")
const { getUrl } = require("../utils")

const setLogs = (logs) => {
	return { type: stats.SETLOGS, logs }
}

module.exports.retrieve = () => (dispatch) => {
	return fetch(getUrl("/logs"), { method: "GET" }).then(a => a.json())
		.then(a => {
			dispatch(setLogs(a))
		})
}