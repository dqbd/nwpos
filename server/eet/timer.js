const eet = require("./index.js")

class Timer {
    constructor(seller, logs) {
        this.logs = logs
        this.seller = seller
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
                    promise = promise.then(result => {
                        let total = log.items.reduce((memo, item, index) => memo + item.price * item.qty, 0)
                        return eet.upload(this.seller, total, log.services.eet.poradCislo, log.services.eet.datTrzby).then(res => {
                            result.push(Object.assign({}, log, { eet: res }))
                            return result
                        }).catch(err => {
                            console.log(err)
                            return Promise.resolve(result)
                        })
                    })
                })

                return promise
            })
            .then(updated => {
                let promise = Promise.resolve([])
                updated.forEach(log => {
                    promise = promise.then(result => this.logs.updateLog(log._id, log))
                })

                return promise
            })
    }
}

module.exports = (logs) => {
    return new Timer(logs)
}