module.exports.__mock = {}
module.exports.get = () => {
    return Object.assign({sellers: [], debug: false}, module.exports.__mock)
}