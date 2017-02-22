module.exports = {
    getLogList: () => Object.keys(),
    retrieveLog: (day) => {
        return Promise.resolve(module.exports.__mocks[day + ".db"])
    },
    updateLog: (day, id, log) => {
        module.exports.__updateCalls({ day, id, log })
        return Promise.resolve(true)
    }
}

module.exports.__updateCalls = []
module.exports.__mocks = {}