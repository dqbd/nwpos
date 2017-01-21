import { connect } from "react-redux"
import { services, stats } from "../../core"
import { hapticFeedback } from "../utils"

import Dashboard from "../components/Dashboard.jsx"

const mapStateToProps = (state) => {
	return {
		list: state.stats.list,
		day: state.stats.day
	}
}

const mapDispatchToProps = (dispatch) => hapticFeedback({
	onPrint: (customer) => dispatch(services.printCart(customer)),
	onDaySelected: (day) => dispatch(stats.retrieveDay(day)) 
})


const StatefulDashboard = connect(mapStateToProps, mapDispatchToProps)(Dashboard)

export default StatefulDashboard