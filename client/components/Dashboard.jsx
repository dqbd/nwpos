import React, { Component } from "react"
import { invokeFeedback } from "../utils"

const getTime = (date) => {
	let parsed = new Date(Date.parse(date))
	let result = []

	result.push(("0" + parsed.getHours()).slice(-2))
	result.push(("0" + parsed.getMinutes()).slice(-2))

	return result.join(":")
}

class Customer extends Component {
	constructor(props) {
		super(props)
		this.state = { opened: false }
	}

	onClick(e) {
		invokeFeedback()
		this.setState({ opened: !this.state.opened })
	}

	renderItems() {
		let {customer} = this.props
		if (this.state.opened) {
			return <ul className="items">
				{customer.cart.items.map((item, index) => (
					<li key={index}>
						<span className="name">{item.name}</span>
						<span className="price">{item.price} Kč</span>
						<span className="qty">{item.qty} ks</span>
						<span className="total">{item.qty * item.price} Kč</span>
					</li>
				))}

			</ul>
		}
	}

	render() {
		let {customer} = this.props
		return (
			<div className="customer" onClick={this.onClick.bind(this)}>
				<div className="metadata">
					<span className="time">{getTime(customer.date)}</span>
					<span className="sumqty">Počet: {customer.cart.items.reduce((memo, item) => memo + item.qty, 0)} ks</span>
					<span className="total">Suma: {customer.cart.items.reduce((memo, item) => memo + item.qty * item.price, 0)} Kč</span>
					<span className="paid">Platba: {customer.paid} Kč</span>
					<span className="returned">Vrátit: {customer.returned * -1} Kč</span>
				</div>
				{this.renderItems()}
			</div>
		)
	}
}

const DayButton = ({active, day, onClick}) => (
	<div className={active ? "day active" : "day"} onClick={onClick}>
		<span className="label">{day.date.split(".").join(". ")}</span>
		<span className="total">{day.total} Kč</span>
	</div>
)

export default class Dashboard extends Component {

	constructor(props) {
		super(props)
		this.state = { selected: 0 }
	}

	renderCustomers() {
		let day = this.props.stats[this.state.selected]	
		if (day !== undefined) {
			return day.customers.map(customer => (
				<Customer key={customer._id} customer={customer} />
			))
		}
	}

	renderDayInfo() {
		let day = this.props.stats[this.state.selected]	

		if (day !== undefined) {
			return <div className="dayinfo">
				<span className="label">{day.date.split(".").join(". ")}</span>
				<span className="total">{day.total} Kč</span>
			</div>
		}
	}

	onClick(selected) {
		invokeFeedback()
		this.setState({ selected })
	}

	render() {
		return <div id="dashboard">
			<div className="day">{this.renderDayInfo()}
				<div className="customers">
					{this.renderCustomers()}
				</div>
			</div>
			<div className="days">
				{this.props.stats.map((day, index) => (
					<DayButton active={index == this.state.selected} onClick={this.onClick.bind(this, index)} key={day.date} day={day} />
				))}
			</div>
		</div>
	}
}