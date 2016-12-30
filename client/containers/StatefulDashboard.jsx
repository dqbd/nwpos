import { connect } from "react-redux"
import Dashboard from "../components/Dashboard.jsx"

const mapStateToProps = (state) => {
	return {
		stats: state.stats 
	}
}


const StatefulDashboard = connect(mapStateToProps)(Dashboard)

export default StatefulDashboard