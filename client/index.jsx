require("./style.styl")

import React from "react"
import ReduxThunk from 'redux-thunk'
import injectTapEventPlugin from "./utils/tap/injectTapEventPlugin"

import { createStore, applyMiddleware } from "redux"
import { Provider } from "react-redux"
import { render } from "react-dom"
import { Router, Route, useRouterHistory } from "react-router"
import { createHashHistory } from "history"

import { reducer } from "../core"
import { bindDisplayEvents } from "./utils/display.js"
import { bindActions } from "./utils/actions.js"

import Main from "./components/Main.jsx"
import Config from "./components/Config.jsx"
import Dashboard from "./containers/StatefulDashboard.jsx"

history.getCurrentLocation = () => (history.location)

let store = createStore(reducer, applyMiddleware(ReduxThunk))
let hashHistory = useRouterHistory(createHashHistory)()
let actions = bindActions(store, hashHistory)

injectTapEventPlugin()
bindDisplayEvents(store)

render(<Provider store={store}>
	<Router history={hashHistory}>
		<Route path="/" component={Config} />
		<Route path="/stats" component={Dashboard} />
	</Router>
</Provider>, document.getElementById("root"))

window.showClient()
window.toggleNight(true)

if (window.android) {
	console.log(JSON.stringify({ actions }))
	window.android.loadFinished(JSON.stringify({ actions }))
}