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
	onCustomerPay: () => {
		dispatch(customer.pay())
		dispatch(customer.log())
	},
	onNumber: (digit) => {
		dispatch(screen.addDigit(digit))
		clearTimeout(throttle)
		throttle = setTimeout(() => dispatch(customer.suggest()), 200)
	},
	onBackspace: () => {
		dispatch(screen.removeDigit())
		clearTimeout(throttle)
		throttle = setTimeout(() => dispatch(customer.suggest()), 200)
	},
	onClear: () => dispatch(screen.clear())
})

const StatefulScreen = connect(mapStateToProps, mapDispatchToProps)(Screen)

export default StatefulScreen