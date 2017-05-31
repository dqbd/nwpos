require("./style.styl")

import React from "react"
import ReduxThunk from 'redux-thunk'
import injectTapEventPlugin from "./utils/tap/injectTapEventPlugin"

import { createStore, applyMiddleware } from "redux"
import { Provider } from "react-redux"
import { render } from "react-dom"
import { HashRouter, Switch, Route } from "react-router-dom"

import { reducer, config } from "../core"
import { capitalize } from "./utils"
import { bindDisplayEvents } from "./utils/display.js"
import { bindActions } from "./utils/actions.js"

import Main from "./pages/Main.jsx"
import Config from "./pages/Config.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import Storage from "./pages/Storage.jsx"

let store = createStore(reducer, applyMiddleware(ReduxThunk))
let actions = bindActions(store)

injectTapEventPlugin()
bindDisplayEvents(store)

render(<Provider store={store}>
	<HashRouter>
		<Switch>
			<Route exact path="/" component={Main} />
			<Route exact path="/config" component={Config} />
			<Route exact path="/stats" component={Dashboard} />
		</Switch>
	</HashRouter>
</Provider>, document.getElementById("root"), (callback) => {
	if (window.android) setTimeout(() => window.android.loadFinished(JSON.stringify({ actions })), 500)
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