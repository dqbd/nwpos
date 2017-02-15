const actions = require("./actions")
const actionTypes = require("./actionTypes")
const seller = require("./index")

const screen = require("../screen")
const customer = require("../customer")
const suggestions = require("../suggestions")

const thunk = require('redux-thunk').default

const nock = require("nock")
const mockStore = require("redux-mock-store").default([thunk])

const { createStore, applyMiddleware } = require("redux")

let store = createStore(seller.reducer, applyMiddleware(thunk))

test("shop still working", () => {
	store.dispatch(screen.set(123))
	store.dispatch(customer.add())

	// tested via suggestions/index.spec.js 
	// store.dispatch(suggestions.suggest(123))
	store.dispatch({ type: suggestions.types.SUGGEST, suggestions: ["vejce", "moje matka"]})

	store.dispatch(screen.addDigit(5))

	expect(store.getState()).toEqual({
		stats: {
			list: [],
			day: undefined
		},
		sellers: [],
		suggestions: {
			all: {},
			contextual: ["vejce", "moje matka"]
		},
		customer: {
			status: "STAGE_TYPING",
			paid: 0,
			screen: 5,
			seller: null,
			cart: {
				selection: 0,
				items: [
					{ name: "", price: 123, qty: 1 }
				]
			},
			services: {
				eet: null,
				log: false,
				print: false
			}
		}
	})
})

test("get sellers", () => {
	let response = {
		sellers: [
			{name: "one", ic: "123456789"},
			{name: "two", ic: "987654321"}
		]		
	}
	nock("http://localhost")
		.get("/sellers")
		.reply(200, response)

	let mock = mockStore()
	return mock.dispatch(actions.retrieveSellers()).then(() => {
		let actions = mock.getActions()

		expect(actions).toEqual([
			{ type: actionTypes.SETSELLERS, sellers: response.sellers }
		])

		store.dispatch({ type: actionTypes.SETSELLERS, sellers: response.sellers })

		expect(store.getState()).toEqual({
			sellers: [
				{name: "one", ic: "123456789"},
				{name: "two", ic: "987654321"}
			],
			suggestions: {
				all: {},
				contextual: ["vejce", "moje matka"]
			},
			stats: {
				list: [],
				day: undefined
			},
			customer: {
				status: "STAGE_TYPING",
				paid: 0,
				screen: 5,
				seller: null,
				cart: {
					selection: 0,
					items: [
						{ name: "", price: 123, qty: 1 }
					]
				},
				services: {
					eet: null,
					log: false,
					print: false
				}
			}
		})
	})

})