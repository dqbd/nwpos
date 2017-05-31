import React, { Component } from "react"
import { Redirect } from 'react-router'
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
	let obj = connect()(Layout)
	obj.path = Layout.path 
	obj.show = () => document.dispatchEvent(new CustomEvent("page", { detail: Layout.path }))
	return obj
}