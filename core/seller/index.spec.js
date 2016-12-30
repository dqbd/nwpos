const actions = require("./actions")
const actionTypes = require("./actionTypes")
const seller = require("./index")

const screen = require("../screen")
const customer = require("../customer")
const suggestions = require("../suggestions")

const thunk = require('redux-thunk').default
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
		info: {
			name: "",
			ic: "",
			dic: "",
			street: "",
			psc: "",
			city: "",
		},
		eet: {
			idProvoz: "",
			idPokl: "",
			cert: "",
			pass: ""
		},
		suggestions: {
			all: {},
			contextual: ["vejce", "moje matka"]
		},
		customer: {
			status: "STAGE_TYPING",
			paid: 0,
			screen: 5,
			cart: {
				selection: 0,
				items: [
					{ name: "", price: 123, qty: 1 }
				]
			},
			services: {
				eet: false,
				log: false,
				print: false
			}
		}
	})
})

test("set info", () => {
	let info = {
		name: "Obchod u Růženky",
		ic: "123456789",
		dic: "CZ1212121218",
		street: "Ostravská 136/6",
		psc: "748 01",
		city: "Hlučín"
	}

	store.dispatch(seller.setInfo(info))
	expect(store.getState().info).toEqual(info)
})

test("set eet", () => {
	let eet = {
		idPokl: "273",
		idProvoz: "/5546/RO24",
		cert: "CZ1212121218.p12",
		pass: "eet"
	}

	store.dispatch(seller.setEet(eet))
	expect(store.getState().eet).toEqual(eet)
})