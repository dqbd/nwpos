const thunk = require('redux-thunk').default
const { createStore, applyMiddleware } = require("redux")

const screen = require("./index")

let store = createStore(screen.reducer, applyMiddleware(thunk))

test("initial state", () => {
	expect(store.getState()).toBe(0)
})

test("check addition", () => {
	store.dispatch(screen.addDigit(1))
	store.dispatch(screen.addDigit(2))
	store.dispatch(screen.addDigit(3))

	expect(store.getState()).toBe(123)
})

test("check removal", () => {
	store.dispatch(screen.removeDigit())
	store.dispatch(screen.removeDigit())
	expect(store.getState()).toBe(1)

	store.dispatch(screen.removeDigit())
	store.dispatch(screen.removeDigit())
	expect(store.getState()).toBe(0)
})

test("check add decimal", () => {
	store.dispatch(screen.enableDecimal())
	store.dispatch(screen.addDigit(1))
	store.dispatch(screen.addDigit(2))
	store.dispatch(screen.addDigit(4))

	expect(store.getState()).toBe(0.123)
})

test("check remove decimal", () => {
	store.dispatch(screen.removeDigit())
	expect(store.getState()).toBe(0.102)

	store.dispatch(screen.removeDigit())
	expect(store.getState()).toBe(0.001)

	store.dispatch(screen.removeDigit())
	expect(store.getState()).toBe(0)
})

test("to negative", () => {
	store.dispatch(screen.addDigit(1))
	store.dispatch(screen.addDigit(2))
	store.dispatch(screen.addDigit(7))
	store.dispatch(screen.enableDecimal())
	store.dispatch(screen.addDigit(3))
	store.dispatch(screen.addDigit(9))
	expect(store.getState()).toBe(127.393)

	store.dispatch(screen.toggleNegative())
	expect(store.getState()).toBe(-127.393)

	store.dispatch(screen.toggleNegative())
	expect(store.getState()).toBe(127.393)
})

test("clearing", () => {
	store.dispatch(screen.clear())
	expect(store.getState()).toBe(0)
})

test("set value", () => {
	store.dispatch(screen.set(123))
	expect(store.getState()).toBe(123)
	
	store.dispatch(screen.set(-123.32456))
	expect(store.getState()).toBe(-123.323)
})

test("digit string", () => {
	store.dispatch(screen.clear())
	store.dispatch(screen.addDigit("1"))
	store.dispatch(screen.addDigit("5"))
	store.dispatch(screen.addDigit("3"))

	expect(store.getState()).toBe(153)
})

test("max length", () => {
	store.dispatch(screen.clear())

	for(let i = 0; i < 10; i++) {
		store.dispatch(screen.addDigit(1))
	}

	expect(store.getState()).toBe(11111111)
})