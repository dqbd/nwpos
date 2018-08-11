import React from "react"
import { PageComponent, Connect } from "./Page.jsx"
import StatefulSuggestionList from "../containers/StatefulSuggestionList.jsx"
import { suggestions } from "../../core"

class SuggestionsLayout extends PageComponent {
	static get path() { return "/suggestions" }

	init(dispatch) {
    dispatch(suggestions.listSuggestions())
	}

	render() {
		return <div id="suggestions">
			<StatefulSuggestionList />
		</div>
	}
}

const Dashboard = Connect(SuggestionsLayout)
export default Dashboard