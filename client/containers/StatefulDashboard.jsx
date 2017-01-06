import { connect } from "react-redux"
import { services } from "../../core"
import { hapticFeedback } from "../utils"

import Dashboard from "../components/Dashboard.jsx"

const mapStateToProps = (state) => {
	return {
		stats: state.stats 
	}
}

const mapDispatchToProps = (dispatch) => hapticFeedback({
	onPrint: (customer) => dispatch(services.printCart(customer))
})


const StatefulDashboard = connect(mapStateToProps, mapDispatchToProps)(Dashboard)

export default StatefulDashboard