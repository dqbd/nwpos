import React from "react"
import { findDOMNode } from "react-dom"
import { invokeFeedback } from "../utils"

class ScanPopup extends React.Component {

	constructor(props) {
		super(props)
		this.state = { input: '' }
	}

	componentDidMount() {
		let dom = findDOMNode(this.refs.input)

		window.setTimeout(() => {
			dom.focus()
			dom.setSelectionRange(0, dom.value.length)
		}, 100)
	}

	componentWillUnmount() {
		clearTimeout(this.throttle)
	}

	onInputChange(event) {
		clearTimeout(this.throttle)
		this.setState({ input: event.target.value }, () => {
			this.throttle = setTimeout(() => {
				this.props.getSearches(this.state.input.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))
			}, 500)
		})
	}
	
	onFormSubmit(event) {
		event.preventDefault()

		if (this.props.searches && this.props.searches.length > 0) {
			this.onEanClick(this.props.searches[0])
		}
	}

	onEanClick({ price, ean, name }) {
		this.props.addEan({ price, name, ean })
		this.onFormClose()
	}

	onFormClose(event) {
		invokeFeedback()
		this.props.clearSearches()
		this.props.onClose()
	}

	render() {
		return (
			<form className="rename popup" onTouchTap={(e) => e.stopPropagation()} onSubmit={this.onFormSubmit.bind(this)}>
				<div className="inside">
					<div className="header">
						<div className="heading">
							<span>Zadat čárový kód</span>
							<div className="input">
								<input ref="input" className="edit" type="text" placeholder="Čárový kód" value={this.state.input} onChange={this.onInputChange.bind(this)}></input>
							</div>
						</div>
						<div className="buttons">
							{ this.props.searches && this.props.searches.length > 0 && <button type="submit" className="ok">
									<svg viewBox="0 0 24 24">
										<path fill="#000000" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
									</svg>
							</button> }
							<a className="close" onTouchTap={this.onFormClose.bind(this)}>
								<svg viewBox="0 0 24 24">
									<path fill="#000000" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
								</svg>
							</a>
						</div>
					</div>
					<div className="content">
						<div className="groups">
							<ul>
								{this.props.searches.map((item, index) => 
									<li key={item.ean} className={['item vertical', index === 0 ? 'selected' : ''].join(' ')}>
										<a onTouchTap={() => this.onEanClick(item)}>
											{item.name}
											<span className="detail">{item.ean}</span>
										</a>
									</li>
								)}
							</ul>
						</div>
					</div>
				</div>
			</form>
		)
	}
}
export default ScanPopup