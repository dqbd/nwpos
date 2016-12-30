import React, { Component } from "react"
import { findDOMNode } from "react-dom"
import CartItem from "./CartItem.jsx"

class Cart extends Component {

	componentDidUpdate(prevProps) {
		if (this.props.selection !== prevProps.selection) {
			let itemComponent = this.refs.active
			if (itemComponent) {
				let domNode = findDOMNode(itemComponent)

				let parentRect = findDOMNode(this).getBoundingClientRect()
				let childRect = domNode.getBoundingClientRect()			

				if (childRect.top < parentRect.top || childRect.bottom > parentRect.bottom) {
					domNode.scrollIntoView()
				}
			}
		}
	}

	render() {
		let { selection, items, onSelect, onAddQty, onDelete, onRename } = this.props

		return <ol className="cart">
			{items.map((item, index) => 
				<CartItem 
					key={index} 
					selected={selection == index} 
					ref={selection == index ? "active" : null}
					index={index} 
					onSelect={onSelect} 
					onRename={onRename}
					onAddQty={onAddQty} 
					onDelete={onDelete}
					{...item} />
			)}
		</ol>
	}
}

export default Cart