import { connect } from "react-redux"
import Button from "../components/DifferenceButton.jsx"

import { customer, cart, screen, services } from "../../core"
import { hapticFeedback, capitalize } from "../utils"

const mapStateToProps = (state) => {
	return {
		total: cart.getTotal(state.customer.cart),
		screen: state.customer.screen
	}
}

const DifferenceButton = connect(mapStateToProps)(Button)
export default DifferenceButton