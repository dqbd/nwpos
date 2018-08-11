import { connect } from "react-redux"
import SuggestionList from "../components/SuggestionList.jsx"

import { suggestions } from "../../core"
import { hapticFeedback } from "../utils"

const mapStateToProps = (state) => {
	return {
		suggestions: Object.values(state.suggestions.all).reduce((memo, list) => memo.concat(list), [])
	}
}

const mapDispatchToProps = (dispatch) => hapticFeedback({
	onItemClick: (name) => dispatch(suggestions.deleteSuggestion(name)),
})

const StatefulSuggestionList = connect(mapStateToProps, mapDispatchToProps)(SuggestionList)

export default StatefulSuggestionList