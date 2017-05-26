import React, { Component } from "react"

export default class SellerColor extends Component {
    render() {
        return <span className="bg" style={{backgroundColor: this.props.color}} />
    }
}