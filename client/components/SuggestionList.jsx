import React, { Component } from "react"

export default class SuggestionList extends Component {
	render() {
		return <div className="suggestions">
			{this.props.suggestions.map(({ name, bought, max_price, min_price, total }, index) => (
				<div key={name} className="item">
					<span className="name">{name}</span>
					<span className="bought">{total.toFixed(2)} / {bought} ks</span>
					<span className="avg">{Math.abs(total / bought).toFixed(2)}</span>
					<span className="btn small delete">
						<a onTouchTap={() => this.props.onItemClick(name)}>
							<svg viewBox="0 0 24 24" width="48px" height="48px">
								<path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
							</svg>
						</a>
					</span>
				</div>
			))}
		</div>
	}
}
