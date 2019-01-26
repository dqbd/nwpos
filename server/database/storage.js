const Database = require("./database")

class Storage extends Database {
    getDb() {
        return super.getDb().then(db => new Promise((resolve, reject) => {
            db.ensureIndex({ fieldName: "ean", unique: true }, (err) => {
                if (err) return reject(err)
                resolve(db)
            })
        }))
    }

    addItem(ean, name, price, qty, retail_price) {
        return this.getDb().then(db => new Promise((resolve, reject) => {
            let doc = { ean, name, price, qty, retail_price }
            Object.keys(doc).forEach((key) => doc[key] == null && delete doc[key])

            doc = Object.assign({ ean: 0, name: "", price: 0, qty: 1, retail_price: 0, retail_qty: 0 }, doc)
            
            doc.name = doc.name.trim().toLowerCase()
            doc.retail_price = doc.price
            doc.retail_qty = doc.qty

            db.insert(doc, (err, data) => {
                if (err) return reject(err)
                resolve(data)
            })
        }))
    }

    updateItem(ean, name, price, qty, retail_price) {
        return this.getDb().then(db => new Promise((resolve, reject) => {
            let doc = { name, price, qty, retail_price }
            Object.keys(doc).forEach((key) => doc[key] == null && delete doc[key])

            if (doc.name) {
                doc.name = doc.name.trim().toLowerCase()
            }

            db.update({ ean }, { $set: doc }, (err, data) => {
                if (err) return reject(err)
                resolve(data)
            })
        }))
    }

    // TODO: we're better off passing non-existent items through
    qtyItem(eans, onlyAvailable = false) {
        if (!eans || Object.keys(eans).length <= 0) return Promise.reject("No eans")
        return this.getDb().then(db => Promise.all(Object.entries(eans).map(([ean, qty]) => {
            console.log('Decrementing', ean, 'with qty of', qty)
            return new Promise((resolve, reject) => {
                db.update(Object.assign({ ean }, onlyAvailable && { qty: {$gt: 1} }), { $inc: { qty: -1 * qty } }, (err, res) => {
                    if (err) return reject(err)
                    resolve(res)
                })
            })
        })))
    }

    generateEan() {
        return this.getDb().then(db => new Promise((resolve, reject) => {
            let attempts = 0
            let reload = () => {
                let ean = Math.floor(Math.random() * (7480100000000 - 7480199999999)) + 7480199999999
                db.count({ ean }, (err, count) => {
                    if (err || count > 0) {
                        if (attempts <= 50) return reject("Excess of 50 attempts")
                        attempts++
                        reload()                        
                    } else {
                        resolve({ ean })
                    }
                }) 
            }

            reload()
        }))
    }

    getItems() {
        return this.getDb().then(db => new Promise((resolve, reject) => {
            db.find({}, (err, items) => {
                if (err) return reject(err)
                resolve({ items })
            })
        }))
    }

    getSearchMapping() {
        return this.getDb().then(db => new Promise((resolve, reject) => {
            db.find({ qty: {$gt: 0} }).projection({ 
                _id: 1, ean: 1, price: 1, name: 1 
            }).sort({ ean: 1 }).exec((err, docs) => {
                if (err) return reject(err)

                resolve(docs.reduce((memo, item) => {
                    memo[item.ean] = item
                    return memo
                }, {}))
            })
        }))
    }

    // TODO: we're better off passing non-existent items through
    getItem(ean, onlyAvailable = false) {
        return this.getDb().then(db => new Promise((resolve, reject) => {
            db.find(Object.assign({ ean }, onlyAvailable && { qty: { $gt: 0 } }), (err, items) => {
                if (err || !items || items.length <= 0) return reject(err || 'Item not found') 
                resolve(items[0])
            })
        }))
    }

    deleteItem(ean) {
        return this.getDb().then(db => new Promise((resolve, reject) => {
            db.remove({ ean }, {}, (err, numRemoved) => {
                if (err) return reject(err)
                return resolve(numRemoved)
            })
        }))
    }

    findItems(query) {
        const searchValues = (query || '').trim().toLowerCase().split(" ")
        if (!query || searchValues.length === 0) return Promise.resolve({ items: [] })
        
        return this.getDb().then(db => new Promise((resolve, reject) => {
            db.find({}, (err, items) => {
                if (err) return reject(err)
                resolve({
                    items: items.filter(({ name, ean }) =>
                        searchValues.every((searchValue) => {
                            return `${ean}`.toLowerCase().includes(searchValue) ||
                                `${name}`.normalize('NFD')
                                    .replace(/[\u0300-\u036f]/g, "")
                                    .toLowerCase()
                                    .includes(searchValue)
                        })
                    ),
                })
            })
        }))
    }
}

module.exports = Storage