jest.autoMockOff()

const actions = require("./actions")
const reducer = require("./reducers")
const actionTypes = require("./actionTypes")
const nock = require("nock")

const configureMockStore = require("redux-mock-store").default
const thunk = require("redux-thunk").default

const mockStore = configureMockStore([thunk])

let payload = {
	"a": [
		{ "name": "aviváž", "min_price": 50, "max_price": 50, "bought": 1, "total": 50 }
	],
	"b": [
		{ "name": "barva na vlasy", "min_price": 62, "max_price": 62, "bought": 1, "total": 62 },
		{ "name": "baterie", "min_price": 10, "max_price": 10, "bought": 1, "total": 10 },
		{ "name": "batoh", "min_price": 250, "max_price": 250, "bought": 1, "total": 250 }
	]
}

let flattened = [
	{ "name": "aviváž", "min_price": 50, "max_price": 50, "bought": 1, "total": 50 },
	{ "name": "barva na vlasy", "min_price": 62, "max_price": 62, "bought": 1, "total": 62 },
	{ "name": "baterie", "min_price": 10, "max_price": 10, "bought": 1, "total": 10 },
	{ "name": "batoh", "min_price": 250, "max_price": 250, "bought": 1, "total": 250 }
]

test("list suggestions", () => {
	nock("http://localhost")
		.get("/suggest")
		.reply(200, payload)

	let store = mockStore()
	return store.dispatch(actions.listSuggestions()).then(() => {
		expect(store.getActions()).toEqual([
			{ type: actionTypes.SETLIST, grouped: payload },
			{ type: actionTypes.SUGGEST, suggestions: flattened }
		])
	})
})

test("suggest", () => {

	let data = undefined
	data = reducer(data, {type: actionTypes.SETLIST, grouped: payload})
	data = reducer(data, {type: actionTypes.SUGGEST, suggestions: flattened})

	let store = mockStore(data)
	store.dispatch(actions.suggest(300))

	expect(store.getActions()).toEqual([
		{ type: actionTypes.SUGGEST, suggestions: [
			{ "name": "batoh", "min_price": 250, "max_price": 250, "bought": 1, "total": 250 },
			{ "name": "barva na vlasy", "min_price": 62, "max_price": 62, "bought": 1, "total": 62 },
			{ "name": "aviváž", "min_price": 50, "max_price": 50, "bought": 1, "total": 50 },
			{ "name": "baterie", "min_price": 10, "max_price": 10, "bought": 1, "total": 10 }
		]}
	])

})