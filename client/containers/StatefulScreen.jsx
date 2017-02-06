import { connect } from "react-redux"
import Screen from "../components/Screen.jsx"

import { customer, screen } from "../../core"
import { hapticFeedback } from "../utils"

const mapStateToProps = (state) => {
	return {
		screen: state.customer.screen,
		status: state.customer.status
	}
}

const mapDispatchToProps = (dispatch) => hapticFeedback({
	onCustomerAdd: () => {
		dispatch(customer.add())
		dispatch(customer.suggest())
	},
	onCustomerPay: () => dispatch(customer.pay()),
	onNumber: (digit) => {
		dispatch(screen.addDigit(digit))
		dispatch(customer.suggest())
	},
	onBackspace: () => {
		dispatch(screen.removeDigit())
		dispatch(customer.suggest())
	},
	onClear: () => {
		dispatch(screen.clear())
		dispatch(customer.suggest())
	}
})

const StatefulScreen = connect(mapStateToProps, mapDispatchToProps)(Screen)

export default StatefulScreen