const { createStore } = require("redux")

let reducer = require("./reducers")
let actionTypes = require("./actionTypes")

let store = createStore(reducer)

test("printing state", () => {
	store.dispatch({ type: actionTypes.PRINT })

	expect(store.getState()).toEqual({
		print: true,
		eet: false,
		log: false
	})
})

test("logging state", () => {
	store.dispatch({ type: actionTypes.LOG, log: true })

	expect(store.getState()).toEqual({
		print: true,
		eet: false,
		log: true
	})
})


test("reset", () => {
	store.dispatch({ type: actionTypes.RESET })
	expect(store.getState()).toEqual({
		print: false,
		eet: false,
		log: false
	})
})