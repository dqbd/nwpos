import { connect } from "react-redux"
import Tabs from "../components/Tabs.jsx"

import { seller } from "../../core"
import { hapticFeedback } from "../utils"

const mapStateToProps = (state) => {
	return {
		tabs: seller.getTabs(state),
		current: state.current,
		nativePrinter: state.nativePrinter,
	}
}

const mapDispatchToProps = (dispatch) => hapticFeedback({
	onTabSwitch: (index) => dispatch(seller.switchTab(index)),
	onTabClose: (index) => dispatch(seller.deleteTab(index)),
	onTabAdd: (index) => dispatch(seller.addTab()) 
})


const StatefulTabs = connect(mapStateToProps, mapDispatchToProps)(Tabs)

export default StatefulTabs