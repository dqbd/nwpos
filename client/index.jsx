require("./style.styl")

import React from "react"
import ReduxThunk from 'redux-thunk'
import injectTapEventPlugin from "./utils/tap/injectTapEventPlugin"

import { createStore, applyMiddleware } from "redux"
import { Provider } from "react-redux"
import { render } from "react-dom"
import { BrowserRouter, Route } from "react-router-dom"

import { reducer, config } from "../core"
import { capitalize } from "./utils"
import { bindDisplayEvents } from "./utils/display.js"
import { bindActions } from "./utils/actions.js"

import Main from "./components/Main.jsx"
import Config from "./components/Config.jsx"
import Dashboard from "./components/Dashboard.jsx"
import Storage from "./components/Storage.jsx"

history.getCurrentLocation = () => (history.location)

let store = createStore(reducer, applyMiddleware(ReduxThunk))
let actions = bindActions(store)

injectTapEventPlugin()
bindDisplayEvents(store)

render(<Provider store={store}>
	<BrowserRouter>
		<div className="routes">
			<Route path="/" component={Main} />
			<Route path="/config" component={Config} />
			<Route path="/stats" component={Dashboard} />
		</div>
	</BrowserRouter>
</Provider>, document.getElementById("root"), (callback) => {
	if (window.android) setTimeout(() => window.android.loadFinished(JSON.stringify({ actions })), 500)
})

window.toggleNight(true)

config.get().then(config => {
	if (config.sellers.length > 0) {
		window.showStats()
	} else {
		window.showConfig()
	}
}).catch(err => {
	window.showClient()
})