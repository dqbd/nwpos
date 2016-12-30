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
	onCustomerPay: () => {
		dispatch(customer.pay())
		dispatch(customer.log())
	},
	onNumber: (digit) => dispatch(screen.addDigit(digit)),
	onBackspace: () => dispatch(screen.removeDigit()),
})

const StatefulScreen = connect(mapStateToProps, mapDispatchToProps)(Screen)

export default StatefulScreen