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
	onCheckout: () => dispatch(customer.pay()),
	onPay: () => dispatch(customer.pay()),
	onEdit: () => dispatch(customer.edit()),
	onPrint: () => {
		dispatch(customer.print())
		dispatch(customer.log())
	},
	onQtySet: () => dispatch(customer.qty()),
	onClear: () => dispatch(customer.clear()),
	onDiscount: () => {
		dispatch(screen.toggleNegative())
		dispatch(customer.add())
		dispatch(cart.renameItem("Sleva"))
		dispatch(screen.toggleNegative())
	}
})

const StatefulPanel = connect(mapStateToProps, mapDispatchToProps)(Panel)
export default StatefulPanel