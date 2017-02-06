import { connect } from "react-redux"
import Panel from "../components/Panel.jsx"

import { customer, cart, screen, services } from "../../core"
import { hapticFeedback, capitalize } from "../utils"

const mapStateToProps = (state) => {
	return {
		status: state.customer.status
	}
}

const mapDispatchToProps = (dispatch) => hapticFeedback({
	onPay: () => dispatch(customer.pay()),
	onEdit: () => dispatch(customer.edit()),
	onPrint: () => dispatch(customer.print()),
	onQtySet: () => dispatch(customer.qty()),
	onClear: () => dispatch(customer.clear()),
	onDrawer: () => dispatch(services.drawer()),
	onDiscount: () => {
		dispatch(screen.toggleNegative())
		dispatch(customer.add())
		dispatch(cart.renameItem("Sleva"))
		dispatch(screen.toggleNegative())
	}
})

const StatefulPanel = connect(mapStateToProps, mapDispatchToProps)(Panel)
export default StatefulPanel