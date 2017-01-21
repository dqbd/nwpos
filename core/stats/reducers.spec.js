const { createStore } = require("redux")

let reducer = require("./reducers")
let actionTypes = require("./actionTypes")


test("set list", () => {
	let store = createStore(reducer)
	let list = ["06.01.2007"]
	store.dispatch({ type: actionTypes.SETLIST, list })
	expect(store.getState()).toEqual({
		list, day: undefined
	})
})

test("set day", () => {
	let store = createStore(reducer)
	let day = {"date":"19.01.2017","total":0,"customers":[]}
	store.dispatch({ type: actionTypes.SETDAY, day })

	expect(store.getState()).toEqual({
		list: [],
		day: day
	})
})