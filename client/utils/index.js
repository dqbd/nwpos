module.exports.hapticFeedback = (mapDispatch) => {
	for (let key of Object.keys(mapDispatch)) {
		mapDispatch[key] = module.exports.bindFeedback(mapDispatch[key])
	}
	return mapDispatch
}

module.exports.bindFeedback = (func) => {
	return function() {
		module.exports.invokeFeedback()
		this.apply(null, arguments)
	}.bind(func)
}

module.exports.invokeFeedback = () =>{
	navigator.vibrate(90)

	if (window.android) {
		window.android.buttonClick()
	}
}

module.exports.capitalize = (input) => {
	return input.charAt(0).toUpperCase() + input.slice(1)
}