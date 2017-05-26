import { connect } from "react-redux"
import SellerColor from "../components/SellerColor.jsx"

import { seller } from "../../core"

const mapStateToProps = (state) => {
    let currentSeller = seller.getCurrentSeller(state)
	return { color: currentSeller ? currentSeller.color : "#03A9F4" }
}

const StatefulSellerColor = connect(mapStateToProps)(SellerColor)

export default StatefulSellerColor