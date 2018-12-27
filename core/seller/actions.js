let actionTypes = require("./actionTypes")
const { get } = require("../utils")

module.exports.addTab = () => {
	return { type: actionTypes.ADDTAB }
}

module.exports.switchTab = (index) => {
	return { type: actionTypes.SWITCHTAB, index }
}

module.exports.deleteTab = (index) => {
	return { type: actionTypes.DELETETAB, index }
}

module.exports.closeAllTabs = () => {
	return { type: actionTypes.CLOSETABS }
}

module.exports.retrieveSellers = () => (dispatch) => {
	return get("/sellers")
		.then(res => {
			dispatch({ type: actionTypes.SETSELLERS, sellers: res.data.sellers })
		})
}

module.exports.retrieveDebug = () => (dispatch) => {
	return get("/debug")
		.then(res => {
			dispatch({ type: actionTypes.SETDEBUG, debug: res.data.debug })
		})
}

module.exports.setNativePrinter = (status) => ({
	type: actionTypes.NATIVE_PRINTER,
	status,
})

module.exports.toggleListenOnScanner = () => ({
	type: actionTypes.LISTEN_SCANNER,
})