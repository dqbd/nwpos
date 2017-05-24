const actions = require("./actions")
const selectors = require("./selectors")

module.exports = Object.assign(actions, selectors)
module.exports.reducer = require("./reducers")
module.exports.types = require("./actionTypes")