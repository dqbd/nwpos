import { connect } from "react-redux"
import SellerPanel from "../components/SellerPanel.jsx"

import { customer } from "../../core"
import { hapticFeedback } from "../utils"

const mapStateToProps = (state) => {
	return {
		sellers: state.sellers,
        active: state.customer.seller
	}
}

const mapDispatchToProps = (dispatch) => hapticFeedback({
	onSellerSet: (ic) => dispatch(customer.seller(ic)) 
})

const StatefulPanel = connect(mapStateToProps, mapDispatchToProps)(SellerPanel)

export default StatefulPanel