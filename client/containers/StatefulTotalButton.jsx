import { connect } from "react-redux"
import Button from "../components/TotalButton.jsx"

import { customer, cart, screen, services } from "../../core"
import { hapticFeedback } from "../utils"

const mapStateToProps = (state) => {
	return {
		total: cart.getTotal(state.customer.cart)
	}
}

const TotalButton = connect(mapStateToProps)(Button)
export default TotalButton