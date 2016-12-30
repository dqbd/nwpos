module.exports.getTotal = (state) => {
	return state.items.reduce((memo, item, index) => memo + item.price * item.qty, 0)
} 
