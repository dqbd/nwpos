import React, { Component } from "react"

export default class SuggestionPanel extends Component {
	render() {
		return <div className="names">
			{this.props.suggestions.map((name, index) => (
				<a key={index} className="suggestion" onTouchTap={() => this.props.onItemRename(name)}>{name}</a>
			))}
		</div>
	}
}
