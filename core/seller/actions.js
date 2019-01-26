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

module.exports.socketConnected = (socketConnected) => ({
	type: actionTypes.SOCKET_CONNECTED,
	socketConnected
})

module.exports.retrieveEanSearches = (query) => (dispatch) => {
	return get('/finditems', { query })
		.then((res) => {
			dispatch({ type: actionTypes.SET_EAN_SEARCHES, items: res.data.items })
		})
}

module.exports.clearEanSearches = () => ({
	type: actionTypes.CLEAR_EAN_SEARCHES,
})

module.exports.addToast = (toast) => ({
	type: actionTypes.ADD_TOAST,
	toast,
})

module.exports.removeToast = (index) => ({
	type: actionTypes.REMOVE_TOAST,
	index,
})

module.exports.clearToasts = () => ({
	type: actionTypes.CLEAR_TOASTS,
})

module.exports.setNativePrinter = (status) => ({
	type: actionTypes.NATIVE_PRINTER,
	status,
})

module.exports.setListenToScanner = (listenToScanner) => ({
	type: actionTypes.LISTEN_SCANNER,
	listenToScanner
})
