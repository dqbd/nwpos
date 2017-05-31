import { suggestions, customer, seller, stats } from "../../core"

let showClient = function() {
	this.store.dispatch(suggestions.listSuggestions())
	this.store.dispatch(seller.retrieveSellers())
	this.store.dispatch(seller.retrieveDebug())
	this.store.dispatch(customer.suggest())
}

let showStats = function() {
	this.store.dispatch(seller.retrieveSellers())
	this.store.dispatch(seller.retrieveDebug())
	this.store.dispatch(stats.retrieveSummary())
	this.store.dispatch(stats.retrieve())
}

let toggleNight = function(ignore = false) {
	let body = document.querySelector("body")
	let value = JSON.parse(window.localStorage.getItem("dark"))
	if (value === null) {
		value = false
	}

	if (ignore === false) {
		value = !value
	}

	if (body) {
		if (value) {
			body.classList.add("dark")
		} else {
			body.classList.remove("dark")
		}
	}

	window.localStorage.setItem("dark", value)
}

let showConfig = function() {

}

let actions = [
	{ func: "showClient", name: "Přejít k pokladně", impl: showClient },
	{ func: "showStats", name: "Zobrazit statistiky", impl: showStats },
	{ func: "showConfig", name: "Konfigurace serveru", impl: showConfig },
	{ func: "toggleNight", name: "Přepnout tmavý režim", impl: toggleNight }
]

module.exports.bindActions = (store) => {

	//bind to window
	let windowObj = {}
	actions.forEach(a => {
		windowObj[a.func] = a.impl.bind({ store })
	})

	Object.assign(window, windowObj)

	//return payload
	return actions.map(({func, name}) => { return { func, name } })
}