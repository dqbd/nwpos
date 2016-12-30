import React from "react"

const Group = ({letter, items, onSuggestionEdit}) => (
	<div className="group">
		<strong className="groupname">{letter}</strong>
		<ul>
			{items.map((item, index) => 
				<li key={index} className="item"><a onTouchTap={(e) => onSuggestionEdit(e)}>{item}</a></li>
			)}
		</ul>
	</div>
)

const SuggestionGroup = ({suggestions, onSuggestionEdit}) => (
	<div className="groups">
		{Object.keys(suggestions).map((letter, index) => <Group key={letter} letter={letter} items={suggestions[letter]} onSuggestionEdit={onSuggestionEdit} />)}
	</div>
)

export default SuggestionGroup