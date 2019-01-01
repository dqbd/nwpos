import React from "react"
import { findDOMNode } from "react-dom"
import { capitalize, czechAlphabet, invokeFeedback } from "../utils"

class ScanPopup extends React.Component {

	constructor(props) {
		super(props)
		this.state = { input: undefined }
	}

	componentDidMount() {
		let dom = findDOMNode(this.refs.input)

		window.setTimeout(() => {
			dom.focus()
			dom.setSelectionRange(0, dom.value.length)
		}, 100)
	}

	onInputChange(event) {
		this.setState({ input: event.target.value })
	}

	onFormSubmit(event) {
		event.preventDefault()
		this.props.onScan(this.state.input)
	}

	onFormClose(event) {
		invokeFeedback()
		this.props.onClose()
	}

	render() {
		console.log(this.state.input)
		return (
			<form className="rename popup" onTouchTap={(e) => e.stopPropagation()} onSubmit={this.onFormSubmit.bind(this)}>
				<div className="inside">
					<div className="header">
						<div className="heading">
							<span>Zadat čárový kód</span>
							<div className="input">
								<input ref="input" className="edit" placeholder="Čárový kód" value={this.state.input} onChange={this.onInputChange.bind(this)}></input>
							</div>
						</div>
						<div className="buttons">
							<button type="submit" className="ok">
								<svg viewBox="0 0 24 24">
									<path fill="#000000" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
								</svg>
							</button>
							<a className="close" onTouchTap={this.onFormClose.bind(this)}>
								<svg viewBox="0 0 24 24">
									<path fill="#000000" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
								</svg>
							</a>
						</div>
					</div>
				</div>
			</form>
		)
	}
}
export default ScanPopup