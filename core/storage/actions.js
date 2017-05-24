const storage = require("./actionTypes")
const { get } = require("../utils")

const setItems = (items) => {
	return { type: storage.SETITEMS, items }
}

module.exports.retrieve = () => (dispatch) => {
	return get("/items").then(a => dispatch(setItems(a.items)))
}