import { connect } from "react-redux"
import Button from "../components/CheckoutButton.jsx"

import { customer } from "../../core"
import { hapticFeedback, capitalize } from "../utils"

const mapStateToProps = (state) => {
	return {
		status: state.customer.status,
		screen: state.customer.screen
	}
}

const CheckoutButton = connect(mapStateToProps)(Button)
export default CheckoutButton