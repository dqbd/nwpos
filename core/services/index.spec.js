const actions = require("./actions")
const actionTypes = require("./actionTypes")
const nock = require("nock")

const configureMockStore = require("redux-mock-store").default
const thunk = require("redux-thunk").default

const mockStore = configureMockStore([thunk])

test("print", () => {
	nock("http://localhost")
		.post("/print", { lines: ["jedna", "dva", "tři"] })
		.reply(200, "good job")

	let store = mockStore()
	return store.dispatch(actions.print(["jedna", "dva", "tři"])).then(() => {
		expect(store.getActions()).toEqual([
			{ type: actionTypes.PRINT }
		])
	})
})


test("log customer", () => {
	let customer = {
		status: "COMMIT_END",
		screen: -234,
		paid: 358,
		services: {
			print: false,
			eet: false,
			log: false,
			suggestions: {
				all: {},
				contextual: []
			}
		},
		cart: {
			selection: 1,
			items: [
				{ name: "", price: 123, qty: 1 },
				{ name: "", price: 1, qty: 1 }
			]
		},
	}

	let payload = {
		customer: {
			returned: -234,
			paid: 358,
			cart: {
				selection: 1,
				items: [
					{ name: "", price: 123, qty: 1 },
					{ name: "", price: 1, qty: 1 }
				]
			}
		}
	}

	let suggestions = {
		a: ["abeceda", "amazonka"],
		b: ["bestie"]
	}

	nock("http://localhost")
		.post("/store", payload)
		.reply(200, {
			a: ["abeceda", "amazonka"],
			b: ["bestie"]
		})

	let store = mockStore()

	return store.dispatch(actions.log(customer)).then(() => {
		let actions = store.getActions()

		expect(actions).toEqual([
			{ type: actionTypes.LOG, log: true },
			{ type: actionTypes.SETLIST, grouped: suggestions }
		])
	})
})

