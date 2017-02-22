import React, { Component } from "react"
import { config } from "../../core"
import { defaultSeller } from "../../server/config/defaultSeller"
import { randomString, invokeFeedback } from "../utils" 

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

	onReset() {
		this.props.onChange(Object.assign({}, defaultSeller))
	}

	onDelete() {
		this.props.onDelete()
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
				<span>Jsem plátce 21% DPH</span>
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
			<input placeholder="Číslo provozovny" type="number" className="idProvoz" onChange={this.onEetChange.bind(this)} value={safeOutput(seller.eet.idProvoz)}></input>
			<label className="checkbox">
				<input className="offline" type="checkbox" onChange={this.onEetChange.bind(this)} checked={safeOutput(seller.eet.offline)} />
				<span>Znova odesílat po neúspěchu</span>
			</label>
			<label className="checkbox">
				<input className="overeni" type="checkbox" onChange={this.onEetChange.bind(this)} checked={safeOutput(seller.eet.overeni)} />
				<span>Pouze ověření (bez FIK)</span>
			</label>
			<label className="checkbox">
				<input className="playground" type="checkbox" onChange={this.onEetChange.bind(this)} checked={safeOutput(seller.eet.playground)} />
				<span>Vývojářské prostředí</span>
			</label>
			<h2>Akce</h2>
			<div className="actions">
				<a className="btn reset" onTouchTap={this.onReset.bind(this)}>Resetovat</a>
				<a className="btn delete" onTouchTap={this.onDelete.bind(this)}>Smazat</a>
			</div>
		</div>
	}
}

export default class Config extends Component {
	constructor(props) {
		super(props)
		this.state = { config: {sellers: [this.getSeller()]}, done: false }
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
		invokeFeedback()
		config.set(this.state.config).then(config => {
			this.setState({ done: true })
			setTimeout(() => this.setState({ done: false }), 1500)
		})
	}

	onReturnClick() {
		invokeFeedback()
		window.showClient()
	}

	onSellerChange(index, seller) {
		let {config} = this.state
		config.sellers[index] = seller
		this.setState({ config })
	}

	onSellerDelete(index) {
		let {config} = this.state
		if (config.sellers.length > 1) {
			config.sellers.splice(index, 1)
		} else {
			config.sellers[index] = Object.assign({}, defaultSeller)
		}

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
			{this.state.config.sellers.map((seller, index) => 
				<Seller 
					key={index} 
					seller={this.getSeller(seller)}
					onDelete={this.onSellerDelete.bind(this, index)}
					onChange={(seller) => this.onSellerChange(index, seller)} />
			)}
			<a className="add" onTouchTap={this.onAddCustomer.bind(this)}>
				<svg viewBox="0 0 24 24"><path d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,7H11V11H7V13H11V17H13V13H17V11H13V7Z" /></svg>
				<span>Přidat prodejnu</span>
			</a>
			<div className="buttons">
				<button className="return" onTouchTap={this.onReturnClick.bind(this)}>Vrátit se</button>
				{!this.state.done ? <button className="save" onTouchTap={this.onSaveClick.bind(this)}>Odeslat</button> : <button className="save done">Odesláno</button>}
			</div>
		</div> 
	}
}
