import React, { Component } from "react"
import { config } from "../../core"
import { defaultSeller } from "../../core/seller"
import { randomString } from "../utils" 

class Seller extends Component {
	constructor(props) {
		super(props)
		this.state = {eetValid: this.props.seller.eet.file !== null}
	}

	componentWillReceiveProps(newProps) {
		this.setState({eetValid: newProps.seller.eet.file !== null})
	}
	changeProps(key, value, prefix) {
		let seller = this.props.seller

		if (seller[key] !== undefined && !prefix || seller[prefix][key] !== undefined) {
			let payload = {[key]: value}
			if (prefix) {
				payload = {
					[prefix]: Object.assign({}, seller[prefix], {
						[key]: value
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

	onChange(e, prefix) {
		this.changeProps(e.target.className, this.getNewValue(e), prefix)
	}

	onEetChange(e) {
		this.changeProps(e.target.className, this.getNewValue(e), "eet")

		//validate when pass changes
		if (e.target.className === "pass") {
			this.onKeyChange({target: this.refs.uploader})
		}
	}

	onKeyChange(e) {
		if (e.target.files.length > 0) {
			let file = e.target.files[0]
			let reader = new FileReader()
			reader.readAsArrayBuffer(file)
			
			reader.onload = (e) => {
				config.validateKey(e.currentTarget.result, this.props.seller.eet.pass).then(res => {
					this.changeProps("file", res.filename, "eet")
				}).catch(err => {
					this.changeProps("file", null, "eet")
				})
			}
		}
	}

	render() {
		let {seller} = this.props
		let safeOutput = (value) => (value === null || value === undefined) ? "" : value 
		return <div className="seller">
			<h2>Základní údaje</h2>
			<input placeholder="IČ" className="ic" type="number" onChange={this.onChange.bind(this)} value={safeOutput(seller.ic)}></input>
			<input placeholder="DIČ" className="dic" onChange={this.onChange.bind(this)} value={safeOutput(seller.dic)}></input>
			<input placeholder="Název prodejny" className="name" onChange={this.onChange.bind(this)} value={safeOutput(seller.name)}></input>
			<input placeholder="Adresa" className="street" onChange={this.onChange.bind(this)} value={safeOutput(seller.street)}></input>
			<input placeholder="Město" className="city" onChange={this.onChange.bind(this)} value={safeOutput(seller.city)}></input>
			<input placeholder="PSČ" className="psc" onChange={this.onChange.bind(this)} value={safeOutput(seller.psc)}></input>
			<label className="checkbox">
				<input className="tax" type="checkbox" onChange={this.onChange.bind(this)} checked={safeOutput(seller.tax)}/>
				<span>DPH</span>
			</label>

			<h2>EET</h2>
			<label className="checkbox">
				<input className="enabled" type="checkbox" onChange={this.onEetChange.bind(this)} checked={safeOutput(seller.eet.enabled)} />
				<span>Odesílat účtenky na Finanční správu</span>
			</label>
			<div className="eet">
				<div className="login">
					<input type="file" ref="uploader" placeholder="Klíč .p12" onChange={this.onKeyChange.bind(this)} accept="application/x-pkcs12" />
					<input placeholder="Heslo klíče" className="pass" type="password" onChange={this.onEetChange.bind(this)} value={safeOutput(seller.eet.pass)}></input>
				</div>
				<div className={this.state.eetValid ? "status valid" : "status invalid"}>
					<svg viewBox="0 0 24 24">
						{this.state.eetValid ?
							<path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" /> :
							<path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
						}
					</svg>
				</div>
			</div>
			<input placeholder="ID Provozovny" type="number" className="idProvoz" onChange={this.onEetChange.bind(this)} value={safeOutput(seller.eet.idProvoz)}></input>
		</div>
	}
}

export default class Config extends Component {
	constructor(props) {
		super(props)
		this.state = { config: {sellers: [this.getSeller()]} }
	}

	getSeller(seller) {
		if (!seller) seller = {}

		let def = Object.assign({}, defaultSeller)
		def.eet.idPokl = randomString(20)

		return Object.assign(def, seller)
	}

	componentDidMount() {
		config.get().then(config => {
			if (config.sellers.length == 0) {
				config.sellers.push(this.getSeller())
			}
			this.setState({ config })
		})
	}

	onSaveClick() {
		config.set(this.state.config)
	}

	onReturnClick() {
		window.showClient()
	}

	onSellerChange(index, seller) {
		let {config} = this.state
		config.sellers[index] = seller
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
			{this.state.config.sellers.map((seller, index) => <Seller onChange={(seller) => this.onSellerChange(index, seller)} seller={this.getSeller(seller)} />)}
			<div className="buttons">
				<button className="return" onClick={this.onReturnClick.bind(this)}>Vrátit se</button>
				<button className="save" onClick={this.onSaveClick.bind(this)}>Odeslat</button>
			</div>
		</div> 
	}
}
