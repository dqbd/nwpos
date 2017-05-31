import React, { Component } from "react"
import { Bar, Doughnut } from 'react-chartjs-2'

export default class Summary extends Component {
	monthToString(input) {
		let labels = ["leden", "únor", "březen", "duben", "květen", "červen", "červenec", "srpen", "září", "říjen", "listopad", "prosinec"]
		let [month, year] = input.split(".")
		return labels[Number.parseInt(month) - 1] + " " + year
	}

	speller(days) {
		if (days === 0 || days >= 5) return `${days} dní`
		if (days === 1) return `${days} den`
		if (days > 1 && days < 5) return `${days} dny`
	}

	renderTable(summary, sellers) {

		let pool = [<div key="head" className="month head">
			<div className="period">Období</div>
			<div className="totals">{sellers.map(seller => <span key={seller.ic} className="seller">
				<span className="name">{seller.name}</span>
				<span className="ic">({seller.ic})</span>
			</span>)}</div>
			<div className="full">Celkem</div>
		</div>]

		for (let month of summary) {
			pool.push(<div key={month.period} className="month">
				<div className="period">{this.monthToString(month.period)} ({this.speller(month.days)})</div>
				<div className="totals">{sellers.map((seller, index) => {
					let total = Object.keys(month.total).reduce((memo, key) => {
						if (index === 0 && sellers.map(i => i.ic).indexOf(key) < 0 || seller.ic === key) {
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

	renderGraph() {
		let {summary, sellers} = this.props
		if (summary.length <= 0 || sellers.length <= 0) return null

		let reverseSummary = summary.slice(0, 12).reverse()
		let bar = {
			labels: reverseSummary.map(item => item.period.replace(".", ". ")),
			datasets: sellers.map((seller, index) => {
				let label = `${seller.name} (${seller.ic})`
				let data = reverseSummary.map(month => Object.keys(month.total).reduce((memo, key) => {
					if (index === 0 && sellers.map(i => i.ic).indexOf(key) < 0 || seller.ic === key) {
						memo += month.total[key] 
					}
					return memo
				}, 0))

				let backgroundColor = seller.color
				return { label, data, backgroundColor }
			})
		}


		let doughnut = {
			labels: sellers.map(seller => `${seller.name} (${seller.ic})`),
			datasets: [{
				data: sellers.map((seller, index) => {
					return summary.reduce((total, month) => {
						total += Object.keys(month.total).reduce((memo, key) => {
							if (index === 0 && sellers.map(i => i.ic).indexOf(key) < 0 || seller.ic === key) {
								memo += month.total[key] 
							}
							return memo
						}, 0)

						return total
					}, 0)
				}),
				backgroundColor: sellers.map((seller) => seller.color)
			}]
		}

		return (<div className="container">
			<div className="bar">
				<Bar data={bar} height={400} options={{ 
					maintainAspectRatio: false,
					tooltips: {
						enabled: false
					},
					scales: {
						yAxes: [{
							ticks: {
								callback: (value, index, values) => {
									return `${(values[0] > 10000) ? Math.floor(value / 1000) + "k" : value}    `
								},
								labelOffset: 130,
								fontFamily: "Montserrat",
								fontStyle: "300"
							},
							stacked: true,
							gridLines: {
								drawTicks: false,
								drawBorder: false,
								color: "rgba(0,0,0,0.2)",
								borderDash: [1,2],
								zeroLineColor: "rgba(0,0,0,0.4)",
							},
							barPercentage: 0.9,
						}],
						xAxes: [{ 
							barPercentage: 0.8,
							scaleLabel: {
								fontFamily: "MS Comic Sans"
							},
							gridLines: {
								color: "rgba(0,0,0,0)",
								zeroLineColor: "rgba(255,255,255,1)"
							},
							ticks: {
								padding: 350,
								mirror: true,
								fontFamily: "Montserrat",
								fontStyle: "300"
							},
						}]
					},
					legend: { display: false }
				}}/>
			</div>
			<div className="doughnut">
				<Doughnut data={doughnut} height={400} options={{
					tooltips: { enabled: true },
					cutoutPercentage: 80,
					maintainAspectRatio: false,	
					legend: { display: false }
				}}/>
				<div className="sum">
					{doughnut.labels.map((label, index) => <p key={label}>
						<span className="label">{label}</span>
						<span className="total" style={{color: doughnut.datasets[0].backgroundColor[index]}}>{doughnut.datasets[0].data[index]} Kč</span>
					</p>)}
				</div>
			</div>
		</div>)

	}

	render() {
		return <div className="day summary">
			<h1>Statistiky</h1>
			<div className="graph">{this.renderGraph()}</div>
			<div className="table">{this.renderTable(this.props.summary, this.props.sellers)}</div>
		</div>
	}
}
