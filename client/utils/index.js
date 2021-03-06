import { actions } from './actions'

module.exports.hapticFeedback = (mapDispatch) => {
	for (let key of Object.keys(mapDispatch)) {
		mapDispatch[key] = module.exports.bindFeedback(mapDispatch[key])
	}
	return mapDispatch
}

module.exports.czechAlphabet = "aábcčdďeéěfghiíjklmnňoópqrřsštťuúůvwxyýzžAÁBCČDĎEÉĚFGHIÍJKLMNŇOÓPQRŘSŠTŤUÚŮVWXYÝZŽ "

module.exports.czechToEnglish = (str) => {
	let english = "aabccddeeefghiijklmnnoopqrrssttuuuvwxyyzzAABCCDDEEEFGHIIJKLMNNOOPQRRSSTTUUUVWXYYZZ "
	return str.split("").map(a => english[module.exports.czechAlphabet.indexOf(a)]).join("")
}

module.exports.bindFeedback = (func) => {
	return function() {
		module.exports.invokeFeedback()
		this.apply(null, arguments)
	}.bind(func)
}

module.exports.printNative = (buffer) => {
	if (window.android) {
		window.android.printOnDevice(buffer)
	}
}

module.exports.hasNativePrinter = () => {
	return (window.android && window.android.hasPrinter())
}

module.exports.hideLoading = () => {
	if (window.android) {
		setTimeout(() => window.android.loadFinished(JSON.stringify({ actions })), 500)
	}
}

module.exports.invokeFeedback = () => {
	if (navigator.vibrate) {
		navigator.vibrate(90)
	}
	if (window.android) {
		window.android.buttonClick()
	}
}

module.exports.capitalize = (input) => {
	return input.charAt(0).toUpperCase() + input.slice(1)
}

module.exports.randomString = (length) => {
	let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
	let payload = ""
	for(let i = 0; i < length; i++) {
		payload += letters.charAt(Math.floor(Math.random() * letters.length))
	}
	return payload
}