let available = {
	suggestion: require("./suggestions"),
	logs: require("./logs")
}

let instances = {}

Object.keys(available).forEach(dbname => {
	module.exports[dbname] = () => {
		if (instances[dbname] === undefined) {
			return instances[dbname] = new available[dbname]()
		}

		return instances[dbname]
	}
})

