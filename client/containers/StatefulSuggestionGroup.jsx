import { connect } from "react-redux"
import SuggestionGroup from "../components/SuggestionGroup.jsx"

import { cart } from "../../core"
import { hapticFeedback } from "../utils"

const mapStateToProps = (state) => {
	return {
		suggestions: state.suggestions.all
	}
}

const StatefulSuggestionGroup = connect(mapStateToProps)(SuggestionGroup)

export default StatefulSuggestionGroup