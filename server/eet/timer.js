const eet = require("./index.js")

class Timer {
    constructor(logs) {
        this.logs = logs
    }

    runTask() {
        if (!this.logs) return Promise.reject("no db for timer")

        return this.logs.getLogList()
            .then(files => files.slice(0, 2))
            .then(dates => {
                let promise = Promise.resolve([])

                dates.forEach(date => {
                    promise = promise.then(result => runTaskForDay(date))
                })

                return promise
            })
    }

    runTaskForDay(day) {
        if (!this.logs) return Promise.reject("no db for timer")

        return this.logs.retrieveLog(day)
            .then(logs => logs.filter(log => {
                return log.services && log.services.eet && !log.services.eet.fik && log.services.eet.pkp
            }))
            .then(logs => {
                let promise = Promise.resolve([])

                logs.forEach(log => {
                    promise = promise.then(result => new Promise((resolve, reject) => {

                    }))
                })
            })
            

    }
}

module.exports = (logs) => {
    return new Timer(logs)
}