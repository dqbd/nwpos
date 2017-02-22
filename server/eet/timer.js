const eet = require("./index.js")

class Timer {
    constructor(config, logs) {
        this.logs = logs
        this.config = config
    }

    enqueue() {
        let now = new Date()
        let future = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), 0, 0, 0)

        try {
            console.log("enqueing", now, future, future.getTime() - now.getTime() + 60 * 60 * 1000)
            setTimeout(() => {
                this.runTask().then(result => {
                    console.log("task fiinished", result)
                }, (err) => {
                    console.log("Task failed", err)
                    return Promise.resolve(err)
                }).then(result => this.enqueue())
            }, future.getTime() - now.getTime() + 60 * 60 * 1000)
        } catch (err) { console.log(err) }
    }

    getSeller(ic) {
		let seller = this.config.get().sellers.find((seller) => seller.ic === ic)
		if (!seller) {
			seller = this.config.get().sellers[0]
		}

        return seller
    }

    runTask() {
        if (!this.logs) return Promise.reject("no db for timer")

        return this.logs.getLogList()
            .then(files => files.slice(0, 2))
            .then(dates => {
                let promise = Promise.resolve([])

                dates.forEach(date => {
                    promise = promise.then(result => this.runTaskForDay(date))
                })

                return promise
            })
    }

    retrieveFailedLogs(day) {
        return this.logs.retrieveLog(day)
        .then(logs => {
            return logs.customers.filter(log => {
                return log.services && log.services.eet && !log.services.eet.fik && log.services.eet.pkp && !log.services.eet.overeni
            })
        })
    }

    resendLog(result, log) {
        console.log("Sending: " + log._id)
        let total = log.cart.items.reduce((memo, item, index) => memo + item.price * item.qty, 0)
        let datTrzby = new Date(Date.parse(log.services.eet.datTrzby))
        let poradCislo = log.services.eet.poradCis

        let currSeller = this.getSeller(log.seller)
        console.log("sending time eet", currSeller.ic, total)

        return eet.upload(currSeller, total, poradCislo, datTrzby).then(res => {
            console.log(res)
            let newCustomer = Object.assign({}, log)
            newCustomer.services.eet = res
            result.push(newCustomer)
            return result
        }, (err) => {
            console.log(err)
            return Promise.resolve(result)
        })
    }

    runTaskForDay(day) {
        if (!this.logs) return Promise.reject("no db for timer")

        return this.retrieveFailedLogs(day)
            .then(logs => {
                let promise = Promise.resolve([])
                logs.forEach(log => {
                    promise = promise.then(result => this.resendLog(result, log))
                        .then(list => new Promise(resolve => setTimeout(() => resolve(list), 1000)))
                })

                return promise
            })
            .then(updated => {
                let promise = Promise.resolve([])
                updated.forEach(log => {
                    promise = promise.then(result => this.logs.updateLog(day, log._id, log))
                })
                return promise
            })
    }
}

module.exports = Timer
module.exports.init = (config, database) => {
    return new Timer(config, database.logs())
}