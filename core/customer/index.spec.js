const screen = require("../screen")
const cart = require("../cart")
const customer = require("./index")

const thunk = require('redux-thunk').default
const { createStore, applyMiddleware } = require("redux")

let store = createStore(customer.reducer, applyMiddleware(thunk))

test("add item via keyboard", () => {
	store.dispatch(screen.addDigit(1))
	store.dispatch(screen.addDigit(2))
	store.dispatch(screen.addDigit(3))

	store.dispatch(customer.add())

	store.dispatch(screen.addDigit(1))
	store.dispatch(customer.add())

	expect(store.getState()).toEqual({
		status: customer.types.STATUS_TYPES.STAGE_ADDED,
		screen: 1,
		paid: 0,
		services: {
			print: false,
			eet: null,
			log: false
		},
		cart: {
			selection: 1,
			items: [
				{ name: "", price: 123, qty: 1 },
				{ name: "", price: 1, qty: 1 }
			]
		},
	})
})

test("clear screen after adding", () => {
	store.dispatch(screen.enableDecimal())
	store.dispatch(screen.addDigit(5))
	store.dispatch(screen.toggleNegative())

	expect(store.getState()).toEqual({
		status: customer.types.STATUS_TYPES.STAGE_TYPING,
		screen: -0.502,
		paid: 0,
		services: {
			print: false,
			eet: null,
			log: false
		},
		cart: {
			selection: 1,
			items: [
				{ name: "", price: 123, qty: 1 },
				{ name: "", price: 1, qty: 1 }
			]
		},
	})
})

test("checkout begin", () => {
	store.dispatch(customer.checkout())

	expect(store.getState()).toEqual({
		status: customer.types.STATUS_TYPES.COMMIT_BEGIN,
		screen: 124,
		paid: 0,
		services: {
			print: false,
			eet: null,
			log: false
		},
		cart: {
			selection: 1,
			items: [
				{ name: "", price: 123, qty: 1 },
				{ name: "", price: 1, qty: 1 }
			]
		},
	})
})

test("checkout payment", () => {
	store.dispatch(screen.addDigit(3))
	store.dispatch(screen.addDigit(5))
	store.dispatch(screen.addDigit(8))

	expect(store.getState()).toEqual({
		status: customer.types.STATUS_TYPES.COMMIT_TYPING,
		screen: 358,
		paid: 0,
		services: {
			print: false,
			eet: null,
			log: false
		},
		cart: {
			selection: 1,
			items: [
				{ name: "", price: 123, qty: 1 },
				{ name: "", price: 1, qty: 1 }
			]
		},
	})
})

test("payment finished", () => {
	store.dispatch(customer.pay())

	expect(store.getState()).toEqual({
		status: customer.types.STATUS_TYPES.COMMIT_END,
		screen: -234,
		paid: 358,
		services: {
			print: false,
			eet: null,
			log: false
		},
		cart: {
			selection: 1,
			items: [
				{ name: "", price: 123, qty: 1 },
				{ name: "", price: 1, qty: 1 }
			]
		},
	})
})

test("new payment", () => {
	store.dispatch(screen.addDigit(1))
	expect(store.getState()).toEqual({
		status: customer.types.STATUS_TYPES.STAGE_TYPING,
		screen: 1,
		paid: 0,
		services: {
			print: false,
			eet: null,
			log: false
		},
		cart: {
			selection: 0,
			items: []
		},
	})
})

test("direct payment", () => {
	store.dispatch(screen.clear())

	for (let i = 0; i < 3; i++) {
		store.dispatch(screen.addDigit(1))
		store.dispatch(screen.addDigit(1))
		store.dispatch(customer.add())
	}

	store.dispatch(screen.set(50))
	store.dispatch(customer.pay())

	expect(store.getState()).toEqual({
		status: customer.types.STATUS_TYPES.COMMIT_END,
		screen: -17,
		paid: 50,
		services: {
			print: false,
			eet: null,
			log: false
		},
		cart: {
			selection: 2,
			items: [
				{ name: "", price: 11, qty: 1 },
				{ name: "", price: 11, qty: 1 },
				{ name: "", price: 11, qty: 1 }
			]
		}
	})
})

test("revert back to edit", () => {
	store.dispatch(screen.clear())

	for (let i = 0; i < 3; i++) {
		store.dispatch(screen.addDigit(1))
		store.dispatch(screen.addDigit(1))
		store.dispatch(customer.add())
	}

	store.dispatch(customer.checkout())
	store.dispatch(screen.set(50))
	store.dispatch(customer.edit())

	store.dispatch(screen.set(15))

	store.dispatch(customer.add())

	expect(store.getState()).toEqual({
		status: customer.types.STATUS_TYPES.STAGE_ADDED,
		screen: 15,
		paid: 0,
		services: {
			print: false,
			eet: null,
			log: false
		},
		cart: {
			selection: 3,
			items: [
				{ name: "", price: 11, qty: 1 },
				{ name: "", price: 11, qty: 1 },
				{ name: "", price: 11, qty: 1 },
				{ name: "", price: 15, qty: 1 }
			]
		}
	})
})

test("quantity payment", () => {
	store.dispatch(cart.addQty(1))
	store.dispatch(cart.setQty(5, 0))

	store.dispatch(screen.set(1000))
	store.dispatch(customer.pay())

	expect(store.getState()).toEqual({
		status: customer.types.STATUS_TYPES.COMMIT_END,
		screen: -893,
		paid: 1000,
		services: {
			print: false,
			eet: null,
			log: false
		},
		cart: {
			selection: 3,
			items: [
				{ name: "", price: 11, qty: 5 },
				{ name: "", price: 11, qty: 1 },
				{ name: "", price: 11, qty: 1 },
				{ name: "", price: 15, qty: 2 }
			]
		}
	})
})

test("multiple adding", () => {
	store.dispatch(screen.clear())
	store.dispatch(cart.clear())

	store.dispatch(screen.set(123))
	store.dispatch(customer.add())
	store.dispatch(customer.add())

	store.dispatch(screen.set(123))
	store.dispatch(customer.add())

	expect(store.getState()).toEqual({
		status: customer.types.STATUS_TYPES.STAGE_ADDED,
		screen: 123,
		paid: 0,
		services: {
			print: false,
			eet: null,
			log: false
		},
		cart: {
			selection: 1,
			items: [
				{ name: "", price: 123, qty: 2 },
				{ name: "", price: 123, qty: 1 }
			]
		}
	})
})

test("set qty", () => {
	store.dispatch(screen.clear())
	store.dispatch(cart.clear())

	store.dispatch(screen.set(123))
	store.dispatch(customer.add())

	store.dispatch(screen.set(256))
	store.dispatch(customer.add())

	store.dispatch(cart.setSelection(0))

	store.dispatch(screen.set(10))
	store.dispatch(customer.qty())

	expect(store.getState()).toEqual({
		status: customer.types.STATUS_TYPES.STAGE_ADDED,
		screen: 123,
		paid: 0,
		services: {
			print: false,
			eet: null,
			log: false
		},
		cart: {
			selection: 0,
			items: [
				{ name: "", price: 123, qty: 10 },
				{ name: "", price: 256, qty: 1 }
			]
		}
	})
})

test("clears correctly", () => {
	store.dispatch(screen.set(4000))
	store.dispatch(customer.pay())
	store.dispatch(customer.clear())

	expect(store.getState()).toEqual({
		status: customer.types.STATUS_TYPES.STAGE_TYPING,
		screen: 0,
		paid: 0,
		services: {
			print: false,
			eet: null,
			log: false
		},
		cart: {
			selection: 0,
			items: []
		}
	})
})

test("doesnt add on screen 0", () => {
	store.dispatch(customer.clear())
	store.dispatch(customer.add())

	expect(store.getState()).toEqual({
		status: customer.types.STATUS_TYPES.STAGE_TYPING,
		screen: 0,
		paid: 0,
		services: {
			print: false,
			eet: null,
			log: false
		},
		cart: {
			selection: 0,
			items: []
		}
	})
})

test("add item with name", () => {
	store.dispatch(screen.clear())
	store.dispatch(cart.clear())

	store.dispatch(screen.set(123))
	store.dispatch(customer.add())

	store.dispatch(screen.set(123))
	store.dispatch(customer.add("Věc"))

	store.dispatch(screen.set(256))
	store.dispatch(customer.add("Novinka"))
	store.dispatch(customer.add("Přepsáno"))
	store.dispatch(customer.add("Přepsáno"))

	store.dispatch(screen.set(256))
	store.dispatch(customer.add("Přepsáno"))

	expect(store.getState()).toEqual({
		status: customer.types.STATUS_TYPES.STAGE_ADDED,
		screen: 256,
		paid: 0,
		services: {
			print: false,
			eet: null,
			log: false
		},
		cart: {
			selection: 3,
			items: [
				{ name: "", price: 123, qty: 1 },
				{ name: "Věc", price: 123, qty: 1 },
				{ name: "Přepsáno", price: 256, qty: 2 },
				{ name: "Přepsáno", price: 256, qty: 1 },
			]
		}
	})
})

test("checkout instead payment when 0", () => {
	store.dispatch(screen.clear())
	store.dispatch(cart.clear())

	store.dispatch(screen.set(123))
	store.dispatch(customer.add())

	store.dispatch(screen.set(0))
	store.dispatch(customer.pay())

	expect(store.getState()).toEqual({
		status: customer.types.STATUS_TYPES.COMMIT_BEGIN,
		screen: 123,
		paid: 0,
		services: {
			print: false,
			eet: null,
			log: false
		},
		cart: {
			selection: 0,
			items: [
				{ name: "", price: 123, qty: 1 }
			]
		}
	})
})

test("checkout instead payment when added", () => {
	store.dispatch(screen.clear())
	store.dispatch(cart.clear())

	store.dispatch(screen.set(123))
	store.dispatch(customer.add()) //add twice
	store.dispatch(customer.add())

	store.dispatch(customer.pay())

	expect(store.getState()).toEqual({
		status: customer.types.STATUS_TYPES.COMMIT_BEGIN,
		screen: 246,
		paid: 0,
		services: {
			print: false,
			eet: null,
			log: false
		},
		cart: {
			selection: 0,
			items: [
				{ name: "", price: 123, qty: 2 }
			]
		}
	})
})