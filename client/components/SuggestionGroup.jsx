import React from "react"

import { capitalize, czechToEnglish } from "../utils"

const Group = ({letter, items, onSuggestionEdit}) => {

	if (items === undefined) {
		return null
	}

	return <div className="group">
		<strong className="groupname">{letter}</strong>
		<ul>
			{items.map((item, index) => 
				<li key={index} className="item"><a onTouchTap={(e) => onSuggestionEdit(e)}>{capitalize(item.name)}</a></li>
			)}
		</ul>
	</div>
}

const SuggestionGroup = ({filter, suggestions, onSuggestionEdit}) => {
	let data = {}
	if (filter) {
		let temp = {}
		Object.keys(suggestions).forEach(a => {
			let list = suggestions[a].filter(item => czechToEnglish(item.name).indexOf(czechToEnglish(filter)) >= 0) 
			if (list.length > 0) {
				temp[a] = list
			}
		})

		let keys = Object.keys(temp)
		keys.unshift(keys.splice(keys.indexOf(filter.toLowerCase()[0]), 1))
		
		keys.forEach(letter => {
			data[letter] = temp[letter]
		})
	} else {
		data = suggestions
	}

	return (<div className="groups">
		{Object.keys(data).map((letter, index) => 
			<Group key={letter} letter={letter} items={data[letter]} onSuggestionEdit={onSuggestionEdit} />)}
	</div>)
}
export default SuggestionGroup