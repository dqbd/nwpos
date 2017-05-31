import React, { Component } from "react"

const DayButton = ({active, day, onClick}) => (
	<div className={active ? "day active" : "day"} onClick={onClick}>
		<span className="label">{day.split(".").join(". ")}</span>
	</div>
)

export default class DashboardList extends Component {
	render() {
		let { day, list, onDaySelected } = this.props
		return <div className="days">
			<DayButton active={!day} onClick={() => onDaySelected(undefined)} day="Souhrn" />
			{list.map(label => (
				<DayButton active={day && label === day.date} onClick={() => onDaySelected(label)} day={label} key={label} />
			))}
		</div>
	}
}