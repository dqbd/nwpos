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

test("list suggestions", () => {
	nock("http://localhost")
		.get("/suggest")
		.reply(200, payload)

	let store = mockStore()
	return store.dispatch(actions.listSuggestions()).then(() => {
		expect(store.getActions()).toEqual([{
			type: actionTypes.SETLIST,
			grouped: payload
		}])
	})
})

test("suggest", () => {

	let store = mockStore(reducer(undefined, {type: actionTypes.SETLIST, grouped: payload}))
	store.dispatch(actions.suggest(300))

	expect(store.getActions()).toEqual([
		{ type: actionTypes.SUGGEST, suggestions: ["batoh", "barva na vlasy", "aviváž", "baterie"] }
	])

})