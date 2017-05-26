import React from "react"
import StatefulCart from "../containers/StatefulCart.jsx"
import RenamePopup from "../components/RenamePopup.jsx"
import StatefulScreen from "../containers/StatefulScreen.jsx"
import StatefulPanel from "../containers/StatefulPanel.jsx"
import StatefulSellerPanel from "../containers/StatefulSellerPanel.jsx"
import StatefulKeyboard from "../containers/StatefulKeyboard.jsx"
import StatefulTabs from "../containers/StatefulTabs.jsx"
import StatefulSellerColor from "../containers/StatefulSellerColor.jsx"

const Main = () => (
	<div className="app">
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
)

export default Main