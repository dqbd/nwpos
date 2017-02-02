import React, {Component} from "react"

class Step extends Component {
	getTitle() { return "" }
	getDescription() { return "" }
	getContent() { return null }
	getButtons() { return [] }
	getClasses() { return [] }
	getImage() { return null }
	
	render() {
		let classes = [this.constructor.name.toLowerCase(), "step", ...this.getClasses()]

		return <div className={classes.join(" ")}>
			<h1>{this.getTitle()}</h1>
			<h2>{this.getDescription()}</h2>

			<div className="image">{this.getImage()}</div>
			{this.getContent()}
			<div className="buttons">{this.getButtons()}</div>
		</div>
	}
}

export default Step