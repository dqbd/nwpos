require("./style.styl")

import React from "react"
import ReduxThunk from 'redux-thunk'
import injectTapEventPlugin from "./utils/tap/injectTapEventPlugin"

import deepEqual from "deep-equal"
import watch from "redux-watch"

import { createStore, applyMiddleware } from "redux"
import { Provider } from "react-redux"
import { render } from "react-dom"
import { Router, Route, useRouterHistory } from "react-router"
import { createHashHistory } from "history"

import { reducer, suggestions, stats, customer } from "../core"

import Main from "./components/Main.jsx"
import Dashboard from "./containers/StatefulDashboard.jsx"

injectTapEventPlugin()
history.getCurrentLocation = () => (history.location)

let store = createStore(reducer, applyMiddleware(ReduxThunk))
let hashHistory = useRouterHistory(createHashHistory)()

window.showStats = () => {
	let { pathname } = hashHistory.getCurrentLocation()
	if (pathname !== "/stats") {
		hashHistory.push("/stats")
		store.dispatch(stats.retrieve())
	}
}

window.showClient = () => {
	let { pathname } = hashHistory.getCurrentLocation()
	if (pathname !== "/") {
		hashHistory.push("/")
	}
	store.dispatch(suggestions.listSuggestions())
}

window.toggleNight = (ignore = false) => {
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

function sendStream(newVal, loc) {
	let payload = {}
	payload[loc.replace("customer.", "")] = newVal

	fetch("http://localhost/stream", {
		method: "POST",
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({customer: payload})
	}).then(a => {
		console.log(a)
	})
}

store.subscribe(watch(store.getState, "customer.cart", deepEqual)((newVal, oldPath, loc) => {
	sendStream(newVal, loc)
}))

store.subscribe(watch(store.getState, "customer.status")((newVal, oldPath, loc) => {
	if (newVal === customer.types.STATUS_TYPES.COMMIT_BEGIN || newVal === customer.types.STATUS_TYPES.COMMIT_END) {
		sendStream(newVal, loc)
	}
}))

store.subscribe(watch(store.getState, "customer.paid")((newVal, oldPath, loc) => {
	sendStream(newVal, loc)
}))

render(<Provider store={store}>
	<Router history={hashHistory}>
		<Route path="/" component={Main} />
		<Route path="/stats" component={Dashboard} />
	</Router>
</Provider>, document.getElementById("root"))

window.showClient()
window.toggleNight(true)

if (window.android) {
	window.android.loadFinished()
}