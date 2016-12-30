import React from "react"

const Difference = ({total, screen, onPay}) => {
	let difference = screen - total
	let differenceStatus = (difference < 0) ? "Doplatit " : "Vrátit "
	let differenceClass = (difference < 0) ? "btn status negative" : "btn status positive"

	if (difference == 0) {
		differenceClass = "btn status"
	}

	return <span key="status" className={differenceClass}><a onTouchTap={onPay}>{differenceStatus} {Math.abs(difference)} Kč</a></span>
}

export default Difference