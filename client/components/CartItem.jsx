import React, { PropTypes, Component } from "react"
import RenamePopup from "./RenamePopup.jsx"

class CartItem extends Component {

	constructor(props) {
		super(props)
		this.state = { showEditName: false }
	}

	onFormRename(result) {
		this.props.onRename(result, this.props.index)
		this.onFormClose()
	}

	onFormClose() {
		this.setState({ showEditName: false })
	}

	onFormOpen() {
		this.setState({ showEditName: true })
	}

	render() {
		let { index, price, qty, name, selected, onSelect, onRename, onAddQty, onDelete } = this.props
		
		return (<li onTouchTap={() => onSelect(index)} className={selected ? "item selected" : "item"}>
				{this.state.showEditName ? <RenamePopup price={price} current={name} onEdit={(e) => this.onFormRename(e)} onClose={() => this.onFormClose()} /> : null}
				<span className="digit inline-btn" onTouchTap={() => onDelete(index)}></span>
				<span className="name" onTouchTap={() => this.onFormOpen()}>{name}</span>
				<span className="price">{price}</span>
				<span className="qty">
					<span className="inline-btn" onTouchTap={() => onAddQty(-1, index)}>&#8722;</span>
					<span className="value">{qty}</span>
					<span className="inline-btn" onTouchTap={() => onAddQty(1, index)}>&#43;</span>
				</span>
				<span className="total">{price * qty}</span>
			</li>
		)
	}
}

export default CartItem