import React, { Component } from "react"
import { Route } from "react-router-dom"
import { connect } from "react-redux"

export class PageComponent extends Component {
	static get path() {
		return "/"
	}

	get path() {
		return this.constructor.path
	}

	componentWillMount() { 
		this.init(this.props.dispatch) 
		this.listener = this.pageListener.bind(this)

		document.addEventListener("page", this.listener)
	}

	pageListener(e) {
		if (e.detail && e.detail !== this.path) {
			console.log("unmounting", this.constructor.name)
			document.removeEventListener("page", this.listener)
			this.props.history.replace(e.detail)
		}
	}

	init() {}
}

export const Connect = (Layout) => {
	let Page = <Route exact path={Layout.path} component={connect()(Layout)} />
	let path = Layout.path 
	let show = () => document.dispatchEvent(new CustomEvent("page", { detail: Layout.path }))
	return { Page, path, show }
}