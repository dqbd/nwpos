module.exports.capitalize = (input) => {
	return input.charAt(0).toUpperCase() + input.slice(1)
}

module.exports.getUrl = (endpoint) => {
	return process.env.BROWSER ? endpoint : "http://localhost" + endpoint
}