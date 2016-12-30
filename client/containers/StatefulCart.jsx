import { connect } from "react-redux"
import Cart from "../components/Cart.jsx"

import { cart } from "../../core"
import { hapticFeedback, capitalize } from "../utils"

const mapStateToProps = (state) => {
	return {
		selection: state.customer.cart.selection,
		items: state.customer.cart.items
	}
}

const mapDispatchToProps = (dispatch) => hapticFeedback({
	onAddQty: (diff, q) => dispatch(cart.addQty(diff, q)),
	onDelete: (q) => dispatch(cart.removeItem(q)),
	onSelect: (index) => dispatch(cart.setSelection(index)),
	onRename: (value, q) => dispatch(cart.renameItem(capitalize(value), q))
})

const StatefulCart = connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(Cart)

export default StatefulCart