import { connect } from "react-redux"
import { stats } from "../../core"
import { hapticFeedback } from "../utils"

import DashboardList from "../components/DashboardList.jsx"

const mapStateToProps = (state) => {
	return {
		list: state.stats.list,
		day: state.stats.day,
	}
}

const mapDispatchToProps = (dispatch) => hapticFeedback({
	onDaySelected: (day) => dispatch(stats.retrieveDay(day)) 
})


const StatefulDashboardList = connect(mapStateToProps, mapDispatchToProps)(DashboardList)

export default StatefulDashboardList