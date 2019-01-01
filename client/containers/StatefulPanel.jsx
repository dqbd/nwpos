import { connect } from "react-redux"
import Panel from "../components/Panel.jsx"

import { customer, cart, screen, services } from "../../core"
import { hapticFeedback, capitalize, printNative, hasNativePrinter } from "../utils"

const mapStateToProps = (state) => {

	return {
		debug: state.debug,
		status: state.customer.status,
		working: state.customer.services.working
	}
}

const mapDispatchToProps = (dispatch) => hapticFeedback({
	onPay: () => dispatch(customer.pay()),
	onEdit: () => dispatch(customer.edit()),
	onPrint: () => dispatch(customer.print(printNative, hasNativePrinter)),
	onQtySet: () => dispatch(customer.qty()),
	onClear: () => dispatch(customer.clear()),
	onDrawer: () => dispatch(services.drawer()),
	onScan: (ean) => dispatch(services.scanEan(ean)),
	onDiscount: () => dispatch(customer.discount())
})

const StatefulPanel = connect(mapStateToProps, mapDispatchToProps)(Panel)
export default StatefulPanel