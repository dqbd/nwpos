import { connect } from "react-redux"
import Keyboard from "../components/Keyboard.jsx"

import { customer, cart, screen, suggestions } from "../../core"
import { capitalize } from "../utils"

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
		onCustomerPay: () => {
			dispatch(customer.pay())
			dispatch(customer.log())
		},
		onNumber: (digit) => dispatch(screen.addDigit(digit)),
		onLetterBackspace: () => dispatch(cart.removeLetter()),
		onNumberBackspace: () => dispatch(screen.removeDigit()),
		onMoveSelection: (diff) => dispatch(cart.moveSelection(diff)),
		onAddQty: (diff) => dispatch(cart.addQty(diff)),
		onDelete: () => dispatch(cart.removeItem())
	}
}


const StatefulKeyboard = connect(mapStateToProps, mapDispatchToProps)(Keyboard)
export default StatefulKeyboard