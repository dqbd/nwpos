import React, { Component } from "react"
import { config } from "../../core"
import { randomString } from "../utils" 

class Seller extends Component {

	onChange(e, prefix) {
		let key = e.target.className
		let seller = this.props.seller
		
		if (seller[key] !== undefined && !prefix || seller[prefix][key] !== undefined) {
			let payload = {[key]: this.getNewValue(e)}
			if (prefix) {
				payload = {
					[prefix]: Object.assign({}, seller[prefix], {
						[key]: this.getNewValue(e)
					})
				}
			}
			
			this.props.onChange(Object.assign({}, seller, payload))
		} else {
			console.log(key)
		}
	}

	getNewValue(e) {
		if (e.target.type.toLowerCase() === "checkbox") {
			return e.target.checked
		} else {
			return e.target.value
		}
	}

	onEetChange(e) {
		this.onChange(e, "eet")
	}

	render() {
		let {seller} = this.props
		return <div className="seller">
			<h2>Základní údaje</h2>
			<input placeholder="IČ" className="ic" onChange={this.onChange.bind(this)} value={seller.ic}></input>
			<input placeholder="DIČ" className="dic" onChange={this.onChange.bind(this)} value={seller.dic}></input>
			<input placeholder="Název prodejny" className="name" onChange={this.onChange.bind(this)} value={seller.name}></input>
			<input placeholder="Adresa" className="street" onChange={this.onChange.bind(this)} value={seller.street}></input>
			<input placeholder="Město" className="city" onChange={this.onChange.bind(this)} value={seller.city}></input>
			<input placeholder="PSČ" className="psc" onChange={this.onChange.bind(this)} value={seller.psc}></input>
			<label className="checkbox">
				<input className="tax" type="checkbox" onChange={this.onChange.bind(this)} checked={seller.tax}/>
				<span>DPH</span>
			</label>

			<h2>EET</h2>
			<label className="checkbox">
				<input className="enabled" type="checkbox" onChange={this.onEetChange.bind(this)} checked={seller.eet.enabled} />
				<span>Odesílat účtenky na Finanční správu</span>
			</label>
			<input placeholder="Heslo klíče" className="pass" onChange={this.onEetChange.bind(this)} value={seller.eet.pass}></input>
			<input placeholder="ID Provozovny" className="idProvoz" onChange={this.onEetChange.bind(this)} value={seller.eet.idProvoz}></input>
		</div>
	}
}

export default class Config extends Component {
	constructor(props) {
		super(props)
		this.state = { config: {sellers: []}, valid: false }
	}

	getSeller(seller) {
		if (!seller) seller = {}

		return Object.assign({
			name: null,
			ic: null,
			street: null,
			psc: null,
			dic: null,
			city: null,
			eet: {
				enabled: false,
				file: "CZ1212121218.p12",
				pass: "eet",
				idPokl: randomString(20),
				idProvoz: null,
				playground: true,
				offline: true
			},
			tax: false
		}, seller)
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

	onSellerChange(index, seller) {
		let {config} = this.state
		config.sellers[index] = seller

		console.log(seller)
		this.setState({ config })
	}

	onAddCustomer() {
		let {config} = this.state
		config.sellers.push(this.getSeller())
		this.setState({config})
	}

	render() {
		let val = this.state.config
		if (this.state.valid) {
			val = JSON.stringify(this.state.config, null, 2)
		}

		return <div id="config">
			{/*<textarea onChange={e => this.onChange(e)} value={val} />*/}
			<button className="add" onClick={this.onAddCustomer.bind(this)}>Přidat zákazníka</button>
			{this.state.config.sellers.map((seller, index) => <Seller onChange={(seller) => this.onSellerChange(index, seller)} seller={this.getSeller(seller)} />)}
			<button disabled={!this.state.valid} onClick={this.onClick.bind(this)}>Odeslat</button>
		</div> 
	}
}
