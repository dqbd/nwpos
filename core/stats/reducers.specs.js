const { createStore } = require("redux")

let reducer = require("./reducers")
let actionTypes = require("./actionTypes")

let store = createStore(reducer)

test("set logs", () => {
	let logs = [{date: "06.01.2017", total: 2780, customers: []}]
	store.dispatch({ type: actionTypes.SETLOGS, logs })
	expect(store.getState()).toEqual(logs)
})
