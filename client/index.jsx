require("./style.styl")

import React from "react"
import ReduxThunk from 'redux-thunk'
import injectTapEventPlugin from "./utils/tap/injectTapEventPlugin"

import { createStore, applyMiddleware } from "redux"
import { Provider } from "react-redux"
import { render } from "react-dom"
import { Router, Route, useRouterHistory } from "react-router"
import { createHashHistory } from "history"

import { reducer, config } from "../core"
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
		<Route path="/" component={Main} />
		<Route path="/config" component={Config} />
		<Route path="/stats" component={Dashboard} />
	</Router>
</Provider>, document.getElementById("root"), (callback) => {
	if (window.android) {
		setTimeout(() => window.android.loadFinished(JSON.stringify({ actions })), 500)
	}
})

window.toggleNight(true)

config.get().then(config => {
	if (config.sellers.length > 0) {
		window.showClient()
	} else {
		window.showConfig()
	}
}).catch(err => {
	window.showClient()
})