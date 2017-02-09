import { connect } from "react-redux"
import Keyboard from "../components/Keyboard.jsx"

import { customer, cart, screen, suggestions } from "../../core"
import { capitalize } from "../utils"

let throttle = null

const mapStateToProps = (state) => {
	return {
		screen: state.customer.screen,
		status: state.customer.status
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onLetter: (letter) => dispatch(cart.addLetter(letter)),
		onCustomerAdd: () => {
			dispatch(customer.add())
			dispatch(customer.suggest())
		},
		onCustomerPay: () => dispatch(customer.pay()),
		onNumber: (digit) => {
			dispatch(screen.addDigit(digit))
			dispatch(customer.suggest())
		},
		onLetterBackspace: () => dispatch(cart.removeLetter()),
		onNumberBackspace: () => {
			dispatch(screen.removeDigit())
			dispatch(customer.suggest())
		},
		onMoveSelection: (diff) => dispatch(cart.moveSelection(diff)),
		onAddQty: (diff) => dispatch(cart.addQty(diff)),
		onDelete: () => dispatch(cart.removeItem())
	}
}


const StatefulKeyboard = connect(mapStateToProps, mapDispatchToProps)(Keyboard)
export default StatefulKeyboard