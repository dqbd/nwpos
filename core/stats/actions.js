const stats = require("./actionTypes")
const fetch = require("isomorphic-fetch")

const getUrl = (endpoint) => {
	return process.env.BROWSER ? endpoint : "http://localhost" + endpoint
}

const setLogs = (logs) => {
	return { type: stats.SETLOGS, logs }
}

module.exports.retrieve = () => (dispatch) => {
	return fetch(getUrl("/logs"), { method: "GET" }).then(a => a.json())
		.then(a => {
			dispatch(setLogs(a))
		})
}