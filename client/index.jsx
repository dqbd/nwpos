require("./style.styl")

import React from "react"
import ReduxThunk from 'redux-thunk'
import injectTapEventPlugin from "./utils/tap/injectTapEventPlugin"

import { createStore, applyMiddleware } from "redux"
import { Provider } from "react-redux"
import { render } from "react-dom"
import { HashRouter, Switch } from "react-router-dom"

import { reducer, config } from "../core"
import { capitalize, hideLoading } from "./utils"
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
			{Main.Page}
			{Config.Page}
			{Dashboard.Page}
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