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
		let { index, price, qty, name, selected, ean, onSelect, onRename, onAddQty, onDelete } = this.props
		
		return (<li onTouchTap={() => onSelect(index)} className={selected ? "item selected" : "item"}>
				{this.state.showEditName ? <RenamePopup price={price} current={name} onEdit={(e) => this.onFormRename(e)} onClose={() => this.onFormClose()} /> : null}
				<span className="digit inline-btn" onTouchTap={() => onDelete(index)}></span>
				<span className="item-detail">
					<span className="name" onTouchTap={() => this.onFormOpen()}>
						{name}
					</span>
					{ean && (
						<span className="ean">
							<svg viewBox='0 0 24 24'>
								<path d='M2,6H4V18H2V6M5,6H6V18H5V6M7,6H10V18H7V6M11,6H12V18H11V6M14,6H16V18H14V6M17,6H20V18H17V6M21,6H22V18H21V6Z' />
							</svg>
						</span>
					)}
					<span className="price">{price}</span>
				</span>
				<span className="inline-btn" onTouchTap={() => onAddQty(-1, index)}>&#8722;</span>
				<span className="qty">{qty}</span>
				<span className="inline-btn" onTouchTap={() => onAddQty(1, index)}>&#43;</span>
				<span className="total">{price * qty}</span>
			</li>
		)
	}
}

export default CartItem