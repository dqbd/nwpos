let cart = require("./actionTypes")

const initialState = {
	selection: 0,
	items: []
}

const updateObject = (old, newO) => {
	return Object.assign({}, old, newO)
}
const updateItemArray = (array, query, activeSelection, callback) => {
	return array.map((item, i) => {
		if (i === query || !Number.isInteger(query) && i === activeSelection) {
			return callback(item, i)
		}

		return item
	})
}

const normalizePrice = (price) => {
	return ((price * 100) | 0) / 100
}

const matchQuery = (i, action, selection) => {
	return i === action.query || !Number.isInteger(action.query) && i === selection
}


function setQuantity(state, action) {
	return updateObject(state, {
		items: updateItemArray(state.items, action.query, state.selection, (item) => {
			return updateObject(item, {qty: action.qty})
		})
	})
}

function addQuantity(state, action) {
	return updateObject(state, {
		items: updateItemArray(state.items, action.query, state.selection, (item) => {
			return updateObject(item, {qty: item.qty + action.increment})
		})
	})
}

function renameItem(state, action) {
	return updateObject(state, {
		items: updateItemArray(state.items, action.query, state.selection, (item) => {
			return updateObject(item, {name: action.name})
		})
	})
}

function addLetterItem(state, action) {
	return updateObject(state, {
		items: updateItemArray(state.items, action.query, state.selection, (item) => {
			if (item.name.trim().length == 0) {
				return updateObject(item, {name: action.letter.toUpperCase()})
			}
			return updateObject(item, {name: item.name + action.letter})
		})
	})
}

function removeLetterItem(state, action) {
	return updateObject(state, {
		items: updateItemArray(state.items, action.query, state.selection, (item) => {
			if (item.name.length > 0) {
				return updateObject(item, {name: item.name.substring(0, item.name.length - 1)})
			} 

			return item
		})
	})
}

function addItem(state, action) {
	if (action.qty == 0) {
		return state
	}

	return updateObject(state, {
		selection: state.items.length,
		items: [...state.items, { name: action.name, price: normalizePrice(action.price), qty: action.qty }]
	})
}

function removeItem(state, action) {
	return updateObject(state, {
		selection: Math.min(state.selection, Math.max(0, state.items.length - 2)),
		items: state.items.filter((a, i) => !(i === action.query || !Number.isInteger(action.query) && i === state.selection))
	})
}

function moveSelection(state, action) {
	return updateObject(state, {
		selection: Math.max(0, Math.min(state.items.length - 1, state.selection + action.increment))
	})
}

function setSelection(state, action) {
	return updateObject(state, {
		selection: Math.max(0, Math.min(state.items.length - 1, action.index))
	})
}

function clear(state, action) {
	return initialState
}

module.exports = (state = initialState, action) => {
	switch (action.type) {
		case cart.ADD_ITEM: return addItem(state, action)
		case cart.REMOVE_ITEM: return removeItem(state, action)
		case cart.RENAME_ITEM: return renameItem(state, action)
		case cart.ADD_LETTER_ITEM: return addLetterItem(state, action)
		case cart.REMOVE_LETTER_ITEM: return removeLetterItem(state, action)
		case cart.ADD_QUANTITY: return addQuantity(state, action)
		case cart.SET_QUANTITY: return setQuantity(state, action)
		case cart.MOVE_SELECTION: return moveSelection(state, action)
		case cart.SET_SELECTION: return setSelection(state, action)
		case cart.CLEAR: return clear(state, action)
	}

	return state
}