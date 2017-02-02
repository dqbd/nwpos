import React, { Component } from "react"
import { config } from "../../core"

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
			<button disabled={!this.state.valid} onClick={this.onClick.bind(this)}>Odeslat</button>
		</div> 
	}
}
