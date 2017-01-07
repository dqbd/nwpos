require("./style.styl")

import React from "react"
import ReduxThunk from 'redux-thunk'
import injectTapEventPlugin from "./utils/tap/injectTapEventPlugin"

import { createStore, applyMiddleware } from "redux"
import { Provider } from "react-redux"
import { render } from "react-dom"
import { Router, Route, useRouterHistory } from "react-router"
import { createHashHistory } from "history"

import { reducer, suggestions, stats,  } from "../core"
import { bindDisplayEvents } from "./utils/display.js"

import Main from "./components/Main.jsx"
import Dashboard from "./containers/StatefulDashboard.jsx"

history.getCurrentLocation = () => (history.location)

let store = createStore(reducer, applyMiddleware(ReduxThunk))
let hashHistory = useRouterHistory(createHashHistory)()

injectTapEventPlugin()
bindDisplayEvents(store)

const actions = {
	showStats: Object.assign(() => {
		let { pathname } = hashHistory.getCurrentLocation()
		if (pathname !== "/stats") {
			hashHistory.push("/stats")
			store.dispatch(stats.retrieve())
		}
	}, { title: "Zobrazit statistiky" }),
	showClient: Object.assign(() => {
		let { pathname } = hashHistory.getCurrentLocation()
		if (pathname !== "/") {
			hashHistory.push("/")
		}
		store.dispatch(suggestions.listSuggestions())
	}, { title: "Přejít k pokladně" }),
	toggleNight: Object.assign((ignore = false) => {
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
	}, { title: "Přepnout tmavý režim" })
}




render(<Provider store={store}>
	<Router history={hashHistory}>
		<Route path="/" component={Main} />
		<Route path="/stats" component={Dashboard} />
	</Router>
</Provider>, document.getElementById("root"))

actions.showClient()
actions.toggleNight(true)

Object.assign(window, actions)

if (window.android) {
	let payload = Object.keys(actions).map(a => {
		return {func: a, name: actions[a].title}
	})

	console.log(JSON.stringify(payload))

	window.android.loadFinished(JSON.stringify({ actions: payload }))
}