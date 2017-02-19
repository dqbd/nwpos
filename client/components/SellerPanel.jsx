import React, { Component } from "react"

class Seller extends Component {

    onClick() {
        this.props.onNext(this.props.seller.ic)
    }

    render() {
        let seller = this.props.seller
        return <div className={this.props.active ? "seller active" : "seller"} onTouchTap={this.onClick.bind(this)}>
            <div className="name">{seller.name}</div>
            <div className="ic">IČ: {seller.ic}</div>
        </div>
    }
}

export default class SellerPanel extends Component {

    setDefaultSeller(props) {
        if (props.active === undefined || props.sellers.findIndex((seller) => seller.ic === props.active) == -1) {
            if (props.sellers.length > 0) props.onSellerSet(props.sellers[0].ic)
        }
    }

    componentDidMount() {
        this.setDefaultSeller(this.props)
    } 

    componentDidUpdate() {
        this.setDefaultSeller(this.props)
    }

    onNext(ic) {
        let index = this.props.sellers.findIndex((seller) => seller.ic === ic)
        if (index + 1 == this.props.sellers.length || index == -1) {
            this.props.onSellerSet(this.props.sellers[0].ic)
        } else {
            this.props.onSellerSet(this.props.sellers[index + 1].ic)
        }
    }
    render() {
        let sellers = this.props.sellers || []
        return <div className="sellers-panel">
            {sellers.map(seller => <Seller key={seller.ic} seller={seller} active={this.props.active === seller.ic} onNext={this.onNext.bind(this)} />)}
        </div>
    }
}