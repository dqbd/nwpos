const { createStore } = require("redux")

let reducer = require("./reducers")
let actionTypes = require("./actionTypes")

let store = createStore(reducer)

test("printing state", () => {
	store.dispatch({ type: actionTypes.PRINT, print: true })

	expect(store.getState()).toEqual({
		print: true,
		eet: null,
		log: false,
		working: false,
		eans: false,
	})
})

test("logging state", () => {
	store.dispatch({ type: actionTypes.LOG, log: true })

	expect(store.getState()).toEqual({
		print: true,
		eet: null,
		log: true,
		working: false,
		eans: false,
	})
})

test("working", () => {
	store.dispatch({ type: actionTypes.STATUS, status: true })
	expect(store.getState()).toEqual({
		print: true,
		eet: null,
		log: true,
		working: true,
		eans: false,
	})
})


test("eet state", () => {
	let eet = {"uuid":"f8567ec6-5e5c-4547-9e97-84a0dceedf5a","bkp":"0F2F1F2B-BF3B6315-FEE010E8-9C111F54-967A23F4","date":"2017-02-04T20:15:21.000Z","test":true,"fik":"7fe51d30-c1f0-4d07-8b6d-0c946ea4769c-ff","warnings":[],"poradCis":"UrwfWNbQ#u92#/dtVyeg","datTrzby":"2017-02-04T20:15:19.802Z"}

	store.dispatch({ type: actionTypes.EET, eet })

	expect(store.getState()).toEqual({
		print: true,
		eet: eet,
		log: true,
		working: true,
		eans: false,
	})
})



test("reset", () => {
	store.dispatch({ type: actionTypes.RESET })
	expect(store.getState()).toEqual({
		print: false,
		eet: null,
		log: false,
		working: false,
		eans: false,
	})
})