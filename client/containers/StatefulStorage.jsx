import { connect } from "react-redux"
import Storage from "../components/Storage.jsx"

import { hapticFeedback } from "../utils"

const mapStateToProps = (state) => {
	return {
	}
}

const StatefulStorage = connect(mapStateToProps)(Storage)

export default StatefulStorage