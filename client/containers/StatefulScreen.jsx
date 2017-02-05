import { connect } from "react-redux"
import Screen from "../components/Screen.jsx"

import { customer, screen } from "../../core"
import { hapticFeedback } from "../utils"

let throttle = null

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
		// clearTimeout(throttle)
		// throttle = setTimeout(() => dispatch(customer.suggest()), 350)
	},
	onBackspace: () => {
		dispatch(screen.removeDigit())
		dispatch(customer.suggest())
		// clearTimeout(throttle)
		// throttle = setTimeout(() => dispatch(customer.suggest()), 350)
	},
	onClear: () => {
		dispatch(screen.clear())
		dispatch(customer.suggest())
	}
})

const StatefulScreen = connect(mapStateToProps, mapDispatchToProps)(Screen)

export default StatefulScreen