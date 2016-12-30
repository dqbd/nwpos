const { createStore } = require("redux")

let reducer = require("./reducers")
let actionTypes = require("./actionTypes")

let store = createStore(reducer)

test("suggest state", () => {
	store.dispatch({ type: actionTypes.SUGGEST, suggestions: ["abeceda", "test"] })

	expect(store.getState()).toEqual({
		all: {},
		contextual: ["abeceda", "test"]
	})
})

test("all suggestions", () => {
	let grouped = {
		a: ["abeceda", "amazonka"],
		b: ["bestie"]
	}

	store.dispatch({ type: actionTypes.SETLIST, grouped })

	expect(store.getState()).toEqual({
		all: grouped,
		contextual: ["abeceda", "test"]
	})
})
