import React from "react"

const Total = ({total, onCheckout}) => {
	return <span key="total" className="btn color total"><a onTouchTap={onCheckout}>Suma {total} Kč</a></span>
}

export default Total