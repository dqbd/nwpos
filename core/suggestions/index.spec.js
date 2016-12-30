const actions = require("./actions")
const actionTypes = require("./actionTypes")
const nock = require("nock")

const configureMockStore = require("redux-mock-store").default
const thunk = require("redux-thunk").default

const mockStore = configureMockStore([thunk])

test("list suggestions", () => {
	nock("http://localhost")
		.get("/suggest")
		.reply(200, {
			a: ["abeceda", "amazonka"],
			b: ["bestie"]
		})


	let store = mockStore()
	return store.dispatch(actions.listSuggestions()).then(() => {
		expect(store.getActions()).toEqual([{
			type: actionTypes.SETLIST,
			grouped: {
				a: ["abeceda", "amazonka"],
				b: ["bestie"]
			}
		}])
	})
})

test("suggest", () => {
	nock("http://localhost")
		.post("/suggest", { price: 300 })
		.reply(200, ["vejce", "moje matka"])

	let store = mockStore()
	return store.dispatch(actions.suggest(300)).then(() => {
		let actions = store.getActions()

		expect(actions).toEqual([
			{ type: actionTypes.SUGGEST, suggestions: ["vejce", "moje matka"] }
		])
	})

})