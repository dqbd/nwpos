require("./style.styl")

import React from "react"
import ReduxThunk from 'redux-thunk'
import injectTapEventPlugin from "./utils/tap/injectTapEventPlugin"

import { createStore, applyMiddleware, compose } from "redux"
import { Provider } from "react-redux"
import { render } from "react-dom"
import { HashRouter, Switch } from "react-router-dom"

import { reducer, config } from "../core"
import { hideLoading } from "./utils"
import { bindDisplayEvents } from "./utils/display.js"
import { bindNativePrinter } from './utils/nativePrinter.js'
import { bindActions } from "./utils/actions.js"
import { bindWebsocket, send } from "./utils/websocket.js"

import Main from "./pages/Main.jsx"
import Config from "./pages/Config.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import Suggestions from "./pages/Suggestions.jsx"
import Storage from "./pages/Storage.jsx"

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
let store = createStore(reducer, composeEnhancers(applyMiddleware(ReduxThunk.withExtraArgument({ send }))))
let actions = bindActions(store)

injectTapEventPlugin()
bindDisplayEvents(store)
bindNativePrinter(store)
bindWebsocket(store)

render(<Provider store={store}>
	<HashRouter>
		<Switch>
			{Main.Page}
			{Config.Page}
			{Dashboard.Page}
			{Suggestions.Page}
		</Switch>
	</HashRouter>
</Provider>, document.getElementById("root"), hideLoading)

window.toggleNight(true)

config.get().then(config => {
	if (config.sellers.length <= 0) {
		window.showConfig()
	} else {
		window.showClient()
	}
}).catch(err => {
	window.showClient()
})