import { connect } from "react-redux"
import { services } from "../../core"
import { hapticFeedback, printNative, hasNativePrinter } from "../utils"

import DashboardDay from "../components/DashboardDay.jsx"

const mapStateToProps = (state) => {
	return {
		day: state.stats.day,
		summary: state.stats.summary,
		sellers: state.sellers
	}
}

const mapDispatchToProps = (dispatch) => hapticFeedback({
	onPrint: (customer) => dispatch(services.printCart(customer, printNative, hasNativePrinter))
})


const StatefulDashboardDay = connect(mapStateToProps, mapDispatchToProps)(DashboardDay)

export default StatefulDashboardDay