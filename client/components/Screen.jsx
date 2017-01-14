import React, { Component } from "react"
import { customer } from "../../core"

const types = customer.types.STATUS_TYPES

export default class Screen extends Component {
	onEnter() {
		if ([types.COMMIT_BEGIN, types.COMMIT_TYPING].indexOf(this.props.status) >= 0) {
			this.props.onCustomerPay()
		} else if (this.props.status === types.COMMIT_END) {
			this.props.onNumber(0)
		} else {
			this.props.onCustomerAdd()
		}
	}

	renderIcon() {
		if ([types.COMMIT_BEGIN, types.COMMIT_TYPING].indexOf(this.props.status) >= 0) {
			return "M19,3H5C3.89,3 3,3.89 3,5V9H5V5H19V19H5V15H3V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M10.08,15.58L11.5,17L16.5,12L11.5,7L10.08,8.41L12.67,11H3V13H12.67L10.08,15.58Z"
		} else if (this.props.status === types.COMMIT_END) {
			return "M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2C6.47,2 2,6.47 2,12C2,17.53 6.47,22 12,22C17.53,22 22,17.53 22,12C22,6.47 17.53,2 12,2M14.59,8L12,10.59L9.41,8L8,9.41L10.59,12L8,14.59L9.41,16L12,13.41L14.59,16L16,14.59L13.41,12L16,9.41L14.59,8Z"
		} else {
			return "M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,7H11V11H7V13H11V17H13V13H17V11H13V7Z"
		}
	}

	render() {
		let { screen, status, onCustomerAdd, onNumber, onBackspace, onCustomerPay, onClear } = this.props

		return (
			<div className="sidebar">
				<div className={"screen " + status}>
					{screen != 0 ? <span className="remove" onLongTouchTap={onClear} onTouchTap={onBackspace}><a>
						<svg viewBox="0 0 24 24">
						    <path fill="#000000" d="M22,3H7C6.31,3 5.77,3.35 5.41,3.88L0,12L5.41,20.11C5.77,20.64 6.31,21 7,21H22A2,2 0 0,0 24,19V5A2,2 0 0,0 22,3M19,15.59L17.59,17L14,13.41L10.41,17L9,15.59L12.59,12L9,8.41L10.41,7L14,10.59L17.59,7L19,8.41L15.41,12" />
						</svg>
					</a></span> : null}
					<span className="value">{screen}</span>
				</div>
				<div className="keypad">
					{[1,2,3,4,5,6,7,8,9].map(i => <span key={i} className="btn"><a onTouchTap={() => onNumber(i)}>{i}</a></span>)}
					<span className="btn color add">
						<a onTouchTap={this.onEnter.bind(this)}>
							<svg viewBox="0 0 24 24"><path d={this.renderIcon()} /></svg>
						</a>
					</span>
					<span key="0" className="btn"><a onTouchTap={() => onNumber(0)}>0</a></span>
				</div>
			</div>
		)
	}
}

