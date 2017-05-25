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

	onPrintClick(e) {
		e.stopPropagation()
		this.props.onPrint(this.props.customer)
	}

	renderItems() {
		let {customer} = this.props
		if (this.state.opened) {
			return <div className="expanded">
				<ul className="items">
					{customer.cart.items.map((item, index) => (
						<li key={index}>
							<span className="name">{item.name}</span>
							<span className="price">{item.price} Kč</span>
							<span className="qty">{item.qty} ks</span>
							<span className="total">{item.qty * item.price} Kč</span>
						</li>
					))}

				</ul>
				<div className="actions">
					<div className="btn print" onClick={this.onPrintClick.bind(this)}><a>Vytisknout</a></div>
				</div>
			</div>
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
		<span className="label">{day.split(".").join(". ")}</span>
	</div>
)

class DayInfo extends Component {
	renderDayInfo() {
		let day = this.props.day

		if (day !== undefined) {
			let sellers = []

			if (this.props.sellers.length > 1) {
				sellers = this.props.sellers.map((seller, index) => {
					seller.sum = day.customers.reduce((sum, customer) => {
						if (!customer.seller && index == 0 || customer.seller && customer.seller == seller.ic) {
							sum += customer.cart.items.reduce((memo, item) => memo + item.qty * item.price, 0)
						}
						return sum
					}, 0)

					return seller
				}).map(seller => 
					<div className="seller" key={seller.ic}>
						<div className="seller-info">
							<span className="name">{seller.name}</span> <span className="ic">({seller.ic})</span>
						</div>
						<span className="sum">{seller.sum} Kč</span>
					</div>
				)
			}

			return <div className="dayinfo">
				<span className="label">{day.date.split(".").join(". ")}</span>
				<div className="seller-total">
					{sellers}
					<div className="seller">
						<div className="seller-info">
							<span className="name">Celkem</span>
						</div>
						<span className="sum">{day.total} Kč</span>
					</div>
				</div>
			</div>
		}
	}

	renderCustomers() {
		let day = this.props.day
		if (day !== undefined) {
			return day.customers.map((customer, key) => (
				<Customer key={key} onPrint={this.props.onPrint} customer={customer} />
			))
		}
	}

	render() {
		return (<div className="day">{this.renderDayInfo()}
			<div className="customers">
				{this.renderCustomers()}
			</div>
		</div>)
	}
}

class Summary extends Component {

	monthToString(input) {
		let labels = ["leden", "únor", "březen", "duben", "květen", "červen", "červenec", "srpen", "září", "říjen", "listopad", "prosinec"]
		let [month, year] = input.split(".")
		return labels[Number.parseInt(month) - 1] + " " + year
	}

	renderTable(summary, sellers) {
		let pool = [<div key="head" className="month head">
			<div className="period">Období</div>
			<div className="totals">{sellers.map(seller => <span key={seller.ic} className="seller">
				<span className="name">{seller.name}</span>
				<span className="ic">({seller.ic})</span>¨
			</span>)}</div>
			<div className="full">Celkem</div>
		</div>]

		for (let month of summary) {
			pool.push(<div key={month.period} className="month">
				<div className="period">{this.monthToString(month.period)} ({month.days} dní)</div>
				<div className="totals">{sellers.map((seller, index) => {
					let total = Object.keys(month.total).reduce((memo, key) => {
						if (key === "0" && index === 0 || seller.ic === key) {
							memo += month.total[key] 
						}
						return memo
					}, 0)

					return <span key={seller.ic} className="total">{total} Kč</span>
				})}</div>
				<div className="full">{Object.values(month.total).reduce((memo, total) => memo + total, 0)} Kč</div>
			</div>)
		}

		return pool
	}

	render() {
		return <div className="day summary">
			<div className="table">{this.renderTable(this.props.summary, this.props.sellers)}</div>
		</div>
	}
}

export default class Dashboard extends Component {
	constructor(props) {
		super(props)
		this.state = { selected: 0 }
	}

	render() {
		let {day, list, summary, sellers, onDaySelected} = this.props
		return <div id="dashboard">
			{day ? <DayInfo {...this.props} /> : <Summary summary={summary} sellers={sellers} />}
			<div className="days">
				{list.map(label => (
					<DayButton active={day && label === day.date} onClick={() => onDaySelected(label)} day={label} key={label} />
				))}
			</div>
		</div>
	}
}