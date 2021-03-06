const actions = require("./actions")
const actionTypes = require("./actionTypes")
const nock = require("nock")

const configureMockStore = require("redux-mock-store").default
const thunk = require("redux-thunk").default

const mockStore = configureMockStore([thunk])

test("retrieve day list", () => {
	let list = ["19.01.2017"]

	nock("http://localhost")
		.get("/loglist")
		.reply(200, list)

	let store = mockStore()
	return store.dispatch(actions.retrieve()).then(() => {
		expect(store.getActions()).toEqual([{
			type: actionTypes.SETLIST,
			list
		}])
	})
})

test("retrieve summary", () => {
	let summary = [{
		"period": "05.2017",
		"days": 7,
		"total": { "1212121218": 10803, "1234567890": 1420 },
	}]

	nock("http://localhost")
		.get("/logsummary")
		.reply(200, summary)
	// TODO

	let store = mockStore()
	return store.dispatch(actions.retrieveSummary()).then(() => {
		expect(store.getActions()).toEqual([{
			type: actionTypes.SETSUMMARY,
			summary
		}])
	})
})

test("retrieve day info", () => {
	let day = {"date":"19.01.2017","total":0,"customers":[]}

	nock("http://localhost")
		.get("/logs")
		.query({"day": "19.01.2017"})
		.reply(200, day)

	let store = mockStore()
	return store.dispatch(actions.retrieveDay("19.01.2017")).then(() => {
		expect(store.getActions()).toEqual([{
			type: actionTypes.SETDAY,
			day
		}])
	})
})