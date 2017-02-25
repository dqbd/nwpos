const actions = require("./actions")
const actionTypes = require("./actionTypes")

const suggestions = require("../suggestions/actionTypes")

const nock = require("nock")

const configureMockStore = require("redux-mock-store").default
const thunk = require("redux-thunk").default

const mockStore = configureMockStore([thunk])

test("print customer", () => {
	let customer = {
		status: "STAGE_TYPING",
		screen: 0, paid: 0,
		seller: "123456789",
		services: { print: false, eet: false, log: false },
		cart: { selection: 0, items: [] }
	}

	nock("http://localhost")
		.post("/print", { customer })
		.reply(200, {})

	let store = mockStore()
	return store.dispatch(actions.printCart(customer)).then(() => {
		expect(store.getActions()).toEqual([
			{ type: actionTypes.PRINT, print: true }
		])
	})
})

test("print native customer", () => {
	let customer = {
		status: "STAGE_TYPING",
		screen: 0, paid: 0,
		seller: "123456789",
		services: { print: false, eet: false, log: false },
		cart: { selection: 0, items: [] }
	}

	nock("http://localhost")
		.post("/print", { customer })
		.reply(500, JSON.stringify({
			buffer: [71, 25, 30]
		}))
	
	let native = jest.fn()

	let store = mockStore()
	return store.dispatch(actions.printCart(customer, native)).then(() => {
		expect(store.getActions()).toEqual([
			{ type: actionTypes.PRINT, print: false }
		])

		expect(native.mock.calls.length).toBe(1)
		expect(native.mock.calls[0][0]).toEqual([71,25,30])
	})
})


test("log customer", () => {
	let customer = {
		status: "COMMIT_END",
		screen: -234,
		paid: 358,
		seller: "123456789",
		services: {
			print: false,
			eet: false,
			log: false
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
			seller: "123456789",
			cart: {
				selection: 1,
				items: [
					{ name: "", price: 123, qty: 1 },
					{ name: "", price: 1, qty: 1 }
				]
			}
		}
	}

	let answer = {
		"a": [
			{ "name": "aviváž", "min_price": 50, "max_price": 50, "bought": 1, "total": 50 }
		],
		"b": [
			{ "name": "barva na vlasy", "min_price": 62, "max_price": 62, "bought": 1, "total": 62 },
			{ "name": "baterie", "min_price": 10, "max_price": 10, "bought": 1, "total": 10 },
			{ "name": "batoh", "min_price": 250, "max_price": 250, "bought": 1, "total": 250 }
		]
	}

	let suggests = [
		{ "name": "aviváž", "min_price": 50, "max_price": 50, "bought": 1, "total": 50 },
		{ "name": "barva na vlasy", "min_price": 62, "max_price": 62, "bought": 1, "total": 62 },
		{ "name": "baterie", "min_price": 10, "max_price": 10, "bought": 1, "total": 10 },
		{ "name": "batoh", "min_price": 250, "max_price": 250, "bought": 1, "total": 250 }
	]

	nock("http://localhost")
		.post("/store", payload)
		.reply(200, answer)

	let store = mockStore()

	return store.dispatch(actions.log(customer)).then(() => {
		let actions = store.getActions()

		expect(actions).toEqual([
			{ type: actionTypes.LOG, log: true },
			{ type: suggestions.SETLIST, grouped: answer },
			{ type: suggestions.SUGGEST, suggestions: suggests },

		])
	})
})

