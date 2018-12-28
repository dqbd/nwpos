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
		listenToScanner: false,
		nativePrinter: null,
		stats: {
			list: [],
			day: undefined,
			summary: []
		},
		debug: false,
		inactive: [],
		current: 0,
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
					{ name: "", price: 123, qty: 1, ean: undefined }
				]
			},
			services: {
				eet: null,
				log: false,
				print: false,
				working: false,
				eans: false,
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
			debug: false,
			inactive: [],
			current: 0,
			suggestions: {
				all: {},
				contextual: ["vejce", "moje matka"]
			},
			listenToScanner: false,
			nativePrinter: null,
			stats: {
				list: [],
				day: undefined,
				summary: []
			},
			customer: {
				status: "STAGE_TYPING",
				paid: 0,
				screen: 5,
				seller: null,
				cart: {
					selection: 0,
					items: [
						{ name: "", price: 123, qty: 1, ean: undefined }
					]
				},
				services: {
					eet: null,
					log: false,
					print: false,
					working: false,
					eans: false,
				}
			}
		})
	})
})

test("add tab", () => {
	store = createStore(seller.reducer, applyMiddleware(thunk))
	store.dispatch({ type: suggestions.types.SUGGEST, suggestions: ["vejce", "moje matka"]})

	store.dispatch(screen.set(123))
	store.dispatch(customer.add())
	store.dispatch(screen.addDigit(5))

	// add new tab
	store.dispatch(seller.addTab())

	store.dispatch(screen.set(456))
	store.dispatch(customer.add())

	store.dispatch(seller.addTab())

	store.dispatch(screen.set(789))
	store.dispatch(customer.add())
	store.dispatch(customer.add())

	expect(store.getState()).toEqual({
		listenToScanner: false,
		nativePrinter: null,
		stats: {
			list: [],
			day: undefined,
			summary: []
		},
		debug: false,
		inactive: [{
			status: "STAGE_TYPING",
			paid: 0,
			screen: 5,
			seller: null,
			cart: {
				selection: 0,
				items: [
					{ name: "", price: 123, qty: 1, ean: undefined }
				]
			},
			services: {
				eet: null,
				log: false,
				print: false,
				working: false,
				eans: false,
			}
		}, {
			status: "STAGE_ADDED",
			paid: 0,
			screen: 456,
			seller: null,
			cart: {
				selection: 0,
				items: [
					{ name: "", price: 456, qty: 1, ean: undefined }
				]
			},
			services: {
				eet: null,
				log: false,
				print: false,
				working: false,
				eans: false,
			}
		}],
		current: 2,
		sellers: [],
		suggestions: {
			all: {},
			contextual: ["vejce", "moje matka"]
		},
		customer: {
			status: "STAGE_ADDED",
			paid: 0,
			screen: 789,
			seller: null,
			cart: {
				selection: 0,
				items: [
					{ name: "", price: 789, qty: 2, ean: undefined }
				]
			},
			services: {
				eet: null,
				log: false,
				print: false,
				working: false,
				eans: false,
			}
		}
	})
})

test("switch tab", () => {
	store.dispatch(seller.switchTab(1))

	expect(store.getState()).toEqual({
		listenToScanner: false,
		nativePrinter: null,
		stats: {
			list: [],
			day: undefined,
			summary: []
		},
		debug: false,
		inactive: [{
			status: "STAGE_TYPING",
			paid: 0,
			screen: 5,
			seller: null,
			cart: {
				selection: 0,
				items: [
					{ name: "", price: 123, qty: 1, ean: undefined }
				]
			},
			services: {
				eet: null,
				log: false,
				print: false,
				working: false,
				eans: false,
			}
		}, {
			status: "STAGE_ADDED",
			paid: 0,
			screen: 789,
			seller: null,
			cart: {
				selection: 0,
				items: [
					{ name: "", price: 789, qty: 2, ean: undefined }
				]
			},
			services: {
				eet: null,
				log: false,
				print: false,
				working: false,
				eans: false,
			}
		}],
		current: 1,
		sellers: [],
		suggestions: {
			all: {},
			contextual: ["vejce", "moje matka"]
		},
		customer: {
			status: "STAGE_ADDED",
			paid: 0,
			screen: 456,
			seller: null,
			cart: {
				selection: 0,
				items: [
					{ name: "", price: 456, qty: 1, ean: undefined }
				]
			},
			services: {
				eet: null,
				log: false,
				print: false,
				working: false,
				eans: false,
			}
		}
	})

})

test("switch tabs greater than current", () => {
	store.dispatch(seller.switchTab(-1)) //invalid
	store.dispatch(seller.switchTab(2)) //valid
	store.dispatch(seller.switchTab(5)) //invalid

	store.dispatch(seller.switchTab(2)) //invalid, should not change

	expect(store.getState()).toEqual({
		listenToScanner: false,
		nativePrinter: null,
		stats: {
			list: [],
			day: undefined,
			summary: []
		},
		debug: false,
		inactive: [{
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
				print: false,
				working: false,
				eans: false,
			}
		}, {
			status: "STAGE_ADDED",
			paid: 0,
			screen: 456,
			seller: null,
			cart: {
				selection: 0,
				items: [
					{ name: "", price: 456, qty: 1 }
				]
			},
			services: {
				eet: null,
				log: false,
				print: false,
				working: false,
				eans: false,
			}
		}],
		current: 2,
		sellers: [],
		suggestions: {
			all: {},
			contextual: ["vejce", "moje matka"]
		},
		customer: {
			status: "STAGE_ADDED",
			paid: 0,
			screen: 789,
			seller: null,
			cart: {
				selection: 0,
				items: [
					{ name: "", price: 789, qty: 2 }
				]
			},
			services: {
				eet: null,
				log: false,
				print: false,
				working: false,
				eans: false,
			}
		}
	})
})

test("delete tab", () => {
	store.dispatch(seller.deleteTab(0))

	expect(store.getState()).toEqual({
		listenToScanner: false,
		nativePrinter: null,
		stats: {
			list: [],
			day: undefined,
			summary: []
		},
		debug: false,
		inactive: [{
			status: "STAGE_ADDED",
			paid: 0,
			screen: 456,
			seller: null,
			cart: {
				selection: 0,
				items: [
					{ name: "", price: 456, qty: 1 }
				]
			},
			services: {
				eet: null,
				log: false,
				print: false,
				working: false,
				eans: false,
			}
		}],
		current: 1,
		sellers: [],
		suggestions: {
			all: {},
			contextual: ["vejce", "moje matka"]
		},
		customer: {
			status: "STAGE_ADDED",
			paid: 0,
			screen: 789,
			seller: null,
			cart: {
				selection: 0,
				items: [
					{ name: "", price: 789, qty: 2 }
				]
			},
			services: {
				eet: null,
				log: false,
				print: false,
				working: false,
				eans: false,
			}
		}
	})

})

test("delete active tab", () => {
	store.dispatch(seller.deleteTab(1))
	store.dispatch(seller.deleteTab(1)) // invalid

	expect(store.getState()).toEqual({
		listenToScanner: false,
		nativePrinter: null,
		stats: {
			list: [],
			day: undefined,
			summary: []
		},
		debug: false,
		inactive: [],
		current: 0,
		sellers: [],
		suggestions: {
			all: {},
			contextual: ["vejce", "moje matka"]
		},
		customer: {
			status: "STAGE_ADDED",
			paid: 0,
			screen: 456,
			seller: null,
			cart: {
				selection: 0,
				items: [
					{ name: "", price: 456, qty: 1 }
				]
			},
			services: {
				eet: null,
				log: false,
				print: false,
				working: false,
				eans: false,
			}
		}
	})
})

test("add tab append style", () => {
	store = createStore(seller.reducer, applyMiddleware(thunk))
	store.dispatch({ type: suggestions.types.SUGGEST, suggestions: ["vejce", "moje matka"]})

	store.dispatch(screen.set(123))
	store.dispatch(customer.add())
	store.dispatch(screen.addDigit(5))

	// add new tab
	store.dispatch(seller.addTab())

	store.dispatch(screen.set(456))
	store.dispatch(customer.add())

	// switch tab 0
	store.dispatch(seller.switchTab(0))
	store.dispatch(seller.addTab())

	store.dispatch(screen.set(789))
	store.dispatch(customer.add())
	store.dispatch(customer.add())

	expect(store.getState()).toEqual({
		listenToScanner: false,
		nativePrinter: null,
		stats: {
			list: [],
			day: undefined,
			summary: []
		},
		debug: false,
		inactive: [{
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
				print: false,
				working: false,
				eans: false,
			}
		}, {
			status: "STAGE_ADDED",
			paid: 0,
			screen: 456,
			seller: null,
			cart: {
				selection: 0,
				items: [
					{ name: "", price: 456, qty: 1 }
				]
			},
			services: {
				eet: null,
				log: false,
				print: false,
				working: false,
				eans: false,
			}
		}],
		current: 2,
		sellers: [],
		suggestions: {
			all: {},
			contextual: ["vejce", "moje matka"]
		},
		customer: {
			status: "STAGE_ADDED",
			paid: 0,
			screen: 789,
			seller: null,
			cart: {
				selection: 0,
				items: [
					{ name: "", price: 789, qty: 2 }
				]
			},
			services: {
				eet: null,
				log: false,
				print: false,
				working: false,
				eans: false,
			}
		}
	})
})


test("close tabs", () => {
	// TODO
	store = createStore(seller.reducer, applyMiddleware(thunk))
	store.dispatch({ type: suggestions.types.SUGGEST, suggestions: ["vejce", "moje matka"]})

	store.dispatch(screen.set(123))
	store.dispatch(customer.add())
	store.dispatch(screen.addDigit(5))

	// add new tab
	store.dispatch(seller.addTab())

	store.dispatch(screen.set(456))
	store.dispatch(customer.add())

	store.dispatch(seller.addTab())

	store.dispatch(screen.set(789))
	store.dispatch(customer.add())
	store.dispatch(customer.add())

	store.dispatch(seller.closeAllTabs())

	expect(store.getState()).toEqual({
		listenToScanner: false,
		nativePrinter: null,
		stats: {
			list: [],
			day: undefined,
			summary: []
		},
		debug: false,
		inactive: [],
		current: 0,
		sellers: [],
		suggestions: {
			all: {},
			contextual: ["vejce", "moje matka"]
		},
		customer: {
			status: "STAGE_ADDED",
			paid: 0,
			screen: 789,
			seller: null,
			cart: {
				selection: 0,
				items: [
					{ name: "", price: 789, qty: 2 }
				]
			},
			services: {
				eet: null,
				log: false,
				print: false,
				working: false,
				eans: false,
			}
		}
	})
})

// TODO: add tests for native printer and scanner