import React, { Component } from "react"

import { customer } from "../../core"

const alphabet = "aábcčdďeéěfghiíjklmnňoópqrřsštťuúůvwxyýzžAÁBCČDĎEÉĚFGHIÍJKLMNŇOÓPQRŘSŠTŤUÚŮVWXYÝZŽ "
const types = customer.types.STATUS_TYPES

export default class Keyboard extends Component {
	constructor(props) {
		super(props)
		this.state = { numberType: false }

		//make unmounting possible
		this.onKeyEvent = this.onKeyEvent.bind(this)
	}

	onKey(event) {
		if("0123456789".indexOf(event.key) >= 0) {
			this.onNumberKeyPress(event)
		} else if (alphabet.indexOf(event.key) >= 0) {
			this.onKeyType(event)
		} else if (event.key === "Backspace") {
			this.onBackspace()
		} else if (event.key === "Enter") {
			this.onEnter()
		} else if (event.key === "ArrowUp") {
			this.onArrowUp()
		} else if (event.key === "ArrowDown") {
			this.onArrowDown()
		} else if (event.key === "Delete") {
			this.onDelete()
		} else if (event.key === "+") {
			this.onAddQty()
		} else if (event.key === "-") {
			this.onRemoveQty()
		}
	}

	onKeyEvent(event) {
		if (!document.querySelector(".popup")) {
			this.onKey(event)
		}
	}

	componentDidMount() {
		document.addEventListener("keydown", this.onKeyEvent)
	}

	componentWillUnmount() {
		document.removeEventListener("keydown", this.onKeyEvent)
	}

	onNumberKeyPress(event) {
		this.setState({ numberType: true })
		this.props.onNumber(event.key)
	}

	onKeyType(event) {
		this.setState({ numberType: false })
		this.props.onLetter(event.key)
	}

	onEnter() {
		if ([types.COMMIT_BEGIN, types.COMMIT_TYPING].indexOf(this.props.status) >= 0) {
			this.props.onCustomerPay()
		} else if (this.props.status === types.COMMIT_END) {
			this.props.onNumber(0)
		} else {
			this.props.onCustomerAdd()
		}
	}

	onAddQty() {
		this.props.onAddQty(1)
	}

	onRemoveQty() {
		this.props.onAddQty(-1)
	}

	onDelete() {
		this.props.onDelete()
	}

	onArrowUp() {
		this.props.onMoveSelection(-1)
	}

	onArrowDown() {
		this.props.onMoveSelection(1)
	}

	onBackspace() {
		if (this.state.numberType) {
			this.props.onNumberBackspace()
		} else {
			this.props.onLetterBackspace()
		}
	}

	render() {
		return <span></span>
	}
}