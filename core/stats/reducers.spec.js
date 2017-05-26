const { createStore } = require("redux")

let reducer = require("./reducers")
let actionTypes = require("./actionTypes")


test("set list", () => {
	let store = createStore(reducer)
	let list = ["06.01.2007"]
	store.dispatch({ type: actionTypes.SETLIST, list })
	expect(store.getState()).toEqual({
		list, day: undefined, summary: []
	})
})

test("set day", () => {
	let store = createStore(reducer)
	let day = {"date":"19.01.2017","total":0,"customers":[]}
	store.dispatch({ type: actionTypes.SETDAY, day })

	expect(store.getState()).toEqual({
		list: [],
		summary: [],
		day: day
	})
})

test("set summary", () => {
	

	let store = createStore(reducer)
	let summary = [{
		"period": "05.2017",
		"days": 7,
		"total": { "1212121218": 10803, "1234567890": 1420 },
	}]

	store.dispatch({ type: actionTypes.SETSUMMARY, summary })

	expect(store.getState()).toEqual({
		list: [],
		summary,
		day: undefined
	})
})
