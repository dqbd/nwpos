import React from "react"
import { PageComponent, Connect } from "./Page.jsx"
import { stats, seller } from "../../core"

import DashboardDay from "../containers/StatefulDashboardDay.jsx"
import DashboardList from "../containers/StatefulDashboardList.jsx"

class DashboardLayout extends PageComponent {
	static get path() { return "/stats" }

	init(dispatch) {
		dispatch(seller.retrieveSellers())
		dispatch(seller.retrieveDebug())
		dispatch(stats.retrieveSummary())
		dispatch(stats.retrieve())
	}

	render() {
		return <div id="dashboard">
			<DashboardDay />
			<DashboardList />
		</div>
	}
}

const Dashboard = Connect(DashboardLayout)
export default Dashboard