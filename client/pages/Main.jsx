import React from "react"
import { PageComponent, Connect } from "./Page.jsx"
import { suggestions, customer, seller } from "../../core"

import StatefulCart from "../containers/StatefulCart.jsx"
import RenamePopup from "../components/RenamePopup.jsx"
import StatefulScreen from "../containers/StatefulScreen.jsx"
import StatefulPanel from "../containers/StatefulPanel.jsx"
import StatefulSellerPanel from "../containers/StatefulSellerPanel.jsx"
import StatefulKeyboard from "../containers/StatefulKeyboard.jsx"
import StatefulTabs from "../containers/StatefulTabs.jsx"
import StatefulSellerColor from "../containers/StatefulSellerColor.jsx"

class MainLayout extends PageComponent {
	static get path() { return "/" }

	init(dispatch) {
		dispatch(suggestions.listSuggestions())
		dispatch(seller.retrieveSellers())
		dispatch(seller.retrieveDebug())
		dispatch(customer.suggest())
	}

	render() {
		return <div className="app">
			<StatefulTabs />
			<StatefulSellerColor />
			<div className="tabcontent">
				<div className="info">
					<StatefulSellerPanel />
					<StatefulCart />
					<StatefulPanel />
				</div>
				<StatefulScreen />
				<StatefulKeyboard />
			</div>
		</div>
	}
}

const Main = Connect(MainLayout)
export default Main 