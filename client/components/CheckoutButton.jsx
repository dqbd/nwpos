import React, { Component } from "react"
import { customer } from "../../core"

import DifferenceButton from "../containers/StatefulDifferenceButton.jsx"

const types = customer.types.STATUS_TYPES

export default class CheckoutButton extends Component {
	render() {
		let {screen, status, onCheckout} = this.props

		if (screen === 0 || status === types.STAGE_ADDED) {
			return <span key="checkout" className="btn color checkout"><a onTouchTap={onCheckout}>Zaplatit</a></span>
		}

		return <DifferenceButton key="diff" onPay={onCheckout} />
	}
}