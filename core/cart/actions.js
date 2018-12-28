const actionTypes = require("./actionTypes")

module.exports.addItem = (price, name = "", qty = 1, ean = undefined) => {
	return { type: actionTypes.ADD_ITEM, price, name, qty, ean }
}

module.exports.renameItem = (name, query) => {
	return { type: actionTypes.RENAME_ITEM, query, name }
}

module.exports.addLetter = (letter, query) => {
	return { type: actionTypes.ADD_LETTER_ITEM, query, letter }
}

module.exports.removeLetter = (query) => {
	return { type: actionTypes.REMOVE_LETTER_ITEM, query }
}

module.exports.removeItem = (query) => {
	return { type: actionTypes.REMOVE_ITEM, query }
}

module.exports.clear = () => {
	return { type: actionTypes.CLEAR }
}

module.exports.addQty = (increment = 1, query = undefined) => {
	return { type: actionTypes.ADD_QUANTITY, query, increment }
}

module.exports.setQty = (qty, query) => {
	return { type: actionTypes.SET_QUANTITY, query, qty }
}

module.exports.setEan = (ean, query) => {
	return { type: actionTypes.SET_EAN, query, ean }
}

module.exports.setSelection = (index) => {
	return { type: actionTypes.SET_SELECTION, index }
}

module.exports.moveSelection = (increment) => {
	return { type: actionTypes.MOVE_SELECTION, increment }
}

