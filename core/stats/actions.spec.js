const actions = require("./actions")
const actionTypes = require("./actionTypes")
const nock = require("nock")

const configureMockStore = require("redux-mock-store").default
const thunk = require("redux-thunk").default

const mockStore = configureMockStore([thunk])

test("retrieve stats", () => {
	let logs = [{date: "06.01.2017", total: 2780, customers: []}]

	nock("http://localhost")
		.get("/logs")
		.reply(200, logs)

	let store = mockStore()
	return store.dispatch(actions.retrieve()).then(() => {
		expect(store.getActions()).toEqual([{
			type: actionTypes.SETLOGS,
			logs
		}])
	})
})