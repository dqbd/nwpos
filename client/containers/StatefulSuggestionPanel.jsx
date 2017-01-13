import { connect } from "react-redux"
import SuggestionPanel from "../components/SuggestionPanel.jsx"

import { cart, customer } from "../../core"
import { hapticFeedback, capitalize } from "../utils"

const mapStateToProps = (state) => {
	return {
		suggestions: state.suggestions.contextual
	}
}

const mapDispatchToProps = (dispatch) => hapticFeedback({
	onItemRename: (name) => dispatch(customer.add(capitalize(name))),
	onLetter: (letter) => dispatch(cart.addLetterItem(letter))
})

const StatefulSuggestionPanel = connect(mapStateToProps, mapDispatchToProps)(SuggestionPanel)

export default StatefulSuggestionPanel