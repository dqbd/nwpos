import Main from "../pages/Main.jsx"
import Dashboard from "../pages/Dashboard.jsx"
import Suggestions from "../pages/Suggestions.jsx"
import Config from "../pages/Config.jsx"

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

let actions = [
	{ func: "showClient", name: "Přejít k pokladně", impl: Main.show },
	{ func: "showStats", name: "Zobrazit statistiky", impl: Dashboard.show },
	{ func: "showConfig", name: "Konfigurace serveru", impl: Config.show },
	{ func: "showSuggestions", name: "Zobrazit našeptávaní", impl: Suggestions.show },
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

module.exports.actions = actions.map(({func, name}) => { return { func, name } })