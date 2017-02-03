import React, { Component } from "react"
import { config } from "../../core"

class Seller extends Component {
	render() {
		return <div className="seller">
			<input placeholder="IČO" className="ico"></input>
			<input placeholder="Název prodejny" className="name"></input>
			<input placeholder="Adresa" className="address"></input>
			<input placeholder="Město" className="city"></input>
			<input placeholder="PSČ" className="psc"></input>
			
			<label className="checkbox">
				<input class="dph" type="checkbox"/>
				<span>DPH</span>
			</label>
		</div>
	}
}

class Basic extends Component {
	render() {
		return <div className="basic">
			<label className="checkbox">
				<input class="display" type="checkbox"/>
				<span>Zobrazit okno pro zákazníky</span>
			</label>

			<input placeholder="Port serveru" type="number" min="0" defaultValue="80" className="port"></input>
		</div>
	}
}

export default class Config extends Component {

	constructor(props) {
		super(props)

		this.state = { config: {}, valid: false }
	}

	componentDidMount() {
		config.get().then(config => {
			console.log(config)
			this.setState({ config, valid: true })
		})
	}

	onChange(e) {
		try {
			JSON.parse(e.target.value)
			this.setState({ config: JSON.parse(e.target.value), valid: true })
		} catch(err) {
			this.setState({ config: e.target.value, valid: false })
		}
	}


	onClick() {
		if (this.state.valid) {
			config.set(this.state.config)
		}
	}

	render() {

		let val = this.state.config
		if (this.state.valid) {
			val = JSON.stringify(this.state.config, null, 2)
		}

		return <div id="config">
			<textarea onChange={e => this.onChange(e)} value={val} />
			{/*<Seller />*/}
			{/*<Basic />*/}
			<button disabled={!this.state.valid} onClick={this.onClick.bind(this)}>Odeslat</button>
		</div> 
	}
}
