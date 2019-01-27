module.exports.getTotal = (state) => {
	return state.items.reduce((memo, item, index) => memo + item.price * item.qty, 0)
} 

module.exports.getEansFromCart = (state) => {
	return state.items.filter(({ ean }) => !!ean).reduce((acc, { qty, ean }) => {
		return Object.assign({}, acc, {
			[ean]: (acc[ean] || 0) + qty
		})
	}, {})
}