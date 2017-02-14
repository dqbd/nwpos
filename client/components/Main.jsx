import React from "react"
import StatefulCart from "../containers/StatefulCart.jsx"
import RenamePopup from "../components/RenamePopup.jsx"
import StatefulScreen from "../containers/StatefulScreen.jsx"
import StatefulPanel from "../containers/StatefulPanel.jsx"
import StatefulSellerPanel from "../containers/StatefulSellerPanel.jsx"
import StatefulKeyboard from "../containers/StatefulKeyboard.jsx"

const Main = () => (
	<div className="app">
		<div className="info">
			<StatefulSellerPanel />
			<StatefulCart />
			<StatefulPanel />
		</div>
		<StatefulScreen />
		<StatefulKeyboard />
	</div>
)

export default Main