import React, { Component } from "react"
import { customer } from "../../core"

import SuggestionPanel from "../containers/StatefulSuggestionPanel.jsx"
import TotalButton from "../containers/StatefulTotalButton.jsx"
import DifferenceButton from "../containers/StatefulDifferenceButton.jsx"


const types = customer.types.STATUS_TYPES

export default class Panel extends Component {
	render() {
		let {status, onCheckout, onEdit, onClear, onDiscount, onPay, onPrint, onQtySet} = this.props
		let actions = []

		if ([types.STAGE_TYPING, types.STAGE_ADDED].indexOf(status) >= 0) {
			actions = [
				<span key="clear" className="btn small clear"><a onTouchTap={onClear}>CE</a></span>,
				<span key="discount" className="btn small discount"><a onTouchTap={onDiscount}>
					<svg viewBox="0 0 24 24"><path d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7,13H17V11H7" /></svg>
				</a></span>,
				<span key="qty" className="btn small qty"><a onTouchTap={onQtySet}>ks</a></span>,
				<TotalButton key="total" onCheckout={onCheckout} />,
				<span key="checkout" className="btn color checkout"><a onTouchTap={onCheckout}>Zaplatit</a></span>
			]
		} else if ([types.COMMIT_BEGIN, types.COMMIT_TYPING].indexOf(status) >= 0) {
			actions = [
				<span key="edit" className="btn small edit"><a onTouchTap={onEdit}>
					<svg viewBox="0 0 24 24"><path d="M21,11H6.83L10.41,7.41L9,6L3,12L9,18L10.41,16.58L6.83,13H21V11Z" /></svg>
				</a></span>,
				<DifferenceButton key="diff" onPay={onPay} />
			]
		} else if (types.COMMIT_END === status) {
			actions = [
				<span key="print" className="btn color print"><a onTouchTap={onPrint}>Vytisknout účtenku</a></span>
			]
		}

		return (
			<div className="panel">
				<SuggestionPanel />
				<div className="actions">{actions}</div>
			</div>
		)

	}
}