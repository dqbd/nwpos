const consts = require("./consts")

module.exports.retrieveCert = (filename, pass) => {
    return Promise.resolve({ ca: [consts.ca], cert: consts.cert, key: consts.key })
}