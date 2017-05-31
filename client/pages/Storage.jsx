import React, { Component } from "react"

let StorageItem = ({ean, name, price, qty, retail_price, retail_qty}) => (
    <div className="item">
        <span className="ean">{ean}</span>
        <span className="name">{name}</span>
        <span className="price">{price}</span>
        <span className="qty">{qty}</span>
        <span className="retail_price">{retail_price}</span>
        <span className="retail_qty">{retail_qty}</span>
    </div>
)

export default class Storage extends Component {
    render() {
        return <div id="storage">
            <div className="panel">
                <span className="total"></span>
                <span className="btn small new"><a>Nový prvek</a></span>
            </div>
            <div className="items">
                <StorageItem />
            </div>
        </div>
    }
}