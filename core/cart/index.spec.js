const { createStore } = require("redux")
const cart = require("./index")

let store = createStore(cart.reducer)

test("add items", () => {
	store.dispatch(cart.addItem(123.12, "Zelenina", 3))
	store.dispatch(cart.addItem(-10.555, "Rohlík"))
	store.dispatch(cart.addItem(56))
	store.dispatch(cart.addItem(12, "neexistuje", 0))

	expect(store.getState()).toEqual({
		selection: 2,
		items: [
			{ name: "Zelenina", price: 123.12, qty: 3 },
			{ name: "Rohlík", price: -10.55, qty: 1 },
			{ name: "", price: 56, qty: 1 }
		]
	})
})

test("rename items", () => {
	store.dispatch(cart.renameItem("Houska", 1))
	store.dispatch(cart.renameItem("Rajče"))

	expect(store.getState()).toEqual({
		selection: 2,
		items: [
			{ name: "Zelenina", price: 123.12, qty: 3 },
			{ name: "Houska", price: -10.55, qty: 1 },
			{ name: "Rajče", price: 56, qty: 1 }
		]
	})
})

test("move & set selection", () => {
	store.dispatch(cart.moveSelection(-1))
	store.dispatch(cart.moveSelection(-1))
	store.dispatch(cart.moveSelection(-1))
	store.dispatch(cart.renameItem("Semeno"))

	store.dispatch(cart.moveSelection(56))
	store.dispatch(cart.renameItem("Hrášek"))

	store.dispatch(cart.setSelection(1))
	store.dispatch(cart.renameItem("Vejce"))

	store.dispatch(cart.setSelection(-123))
	store.dispatch(cart.renameItem("Semena"))

	store.dispatch(cart.setSelection(123))
	store.dispatch(cart.renameItem("Hrášky"))

	store.dispatch(cart.setSelection(1))

	expect(store.getState()).toEqual({
		selection: 1,
		items: [
			{ name: "Semena", price: 123.12, qty: 3 },
			{ name: "Vejce", price: -10.55, qty: 1 },
			{ name: "Hrášky", price: 56, qty: 1 }
		]
	})
})

test("add & set qty", () => {
	store.dispatch(cart.addQty(56))
	store.dispatch(cart.addQty(-25))

	store.dispatch(cart.setSelection(2))
	store.dispatch(cart.setQty(-12))

	expect(store.getState()).toEqual({
		selection: 2,
		items: [
			{ name: "Semena", price: 123.12, qty: 3 },
			{ name: "Vejce", price: -10.55, qty: 32 },
			{ name: "Hrášky", price: 56, qty: -12 }
		]
	})
})

test("remove item", () => {
	store.dispatch(cart.removeItem())
	store.dispatch(cart.removeItem(0))

	expect(store.getState()).toEqual({
		selection: 0,
		items: [
			{ name: "Vejce", price: -10.55, qty: 32 }
		]
	})
})

test("clear", () => {
	store.dispatch(cart.addItem(12))
	store.dispatch(cart.clear())
	
	expect(store.getState()).toEqual({
		selection: 0,
		items: []
	})
})

test("add letter", () => {
	store.dispatch(cart.clear())
	store.dispatch(cart.addItem(15))
	store.dispatch(cart.addItem(350))

	store.dispatch(cart.setSelection(0))

	store.dispatch(cart.addLetter("a"))
	store.dispatch(cart.addLetter("d"))
	store.dispatch(cart.addLetter("b", 1))

	expect(store.getState()).toEqual({
		selection: 0,
		items: [
			{ name: "Ad", price: 15, qty: 1 },
			{ name: "B", price: 350, qty: 1 }
		]
	})

})

test("remove letter", () => {
	store.dispatch(cart.clear())
	store.dispatch(cart.addItem(15))
	store.dispatch(cart.renameItem("Abc"))
	store.dispatch(cart.addItem(350))
	store.dispatch(cart.renameItem("D"))


	store.dispatch(cart.removeLetter())
	store.dispatch(cart.removeLetter())

	store.dispatch(cart.removeLetter(0))

	expect(store.getState()).toEqual({
		selection: 1,
		items: [
			{ name: "Ab", price: 15, qty: 1 },
			{ name: "", price: 350, qty: 1 }
		]
	})

})