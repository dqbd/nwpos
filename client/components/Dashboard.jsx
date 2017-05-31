import React, { Component } from "react"

import DashboardDay from "../containers/StatefulDashboardDay.jsx"
import DashboardList from "../containers/StatefulDashboardList.jsx"

export default class Dashboard extends Component {
	render() {
		return <div id="dashboard">
			<DashboardDay />
			<DashboardList />
		</div>
	}
}