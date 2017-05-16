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

    setItem(ean, name, price, qty, retail_price) {
        return this.getDb().then(db => new Promise((resolve, reject) => {
            let retail_amount = price

            let callback = (err, data) => {
                if (err) return reject(err)
                resolve(data)
            }

            db.count({ ean }, (err, count) => {
                if (err) return reject(err)

                let doc = { ean, name, price, qty, retail_price }
                Object.keys(doc).forEach((key) => doc[key] == null && delete doc[key])

                if (count > 0) {
                    db.update({ ean }, doc, callback)
                } else {
                    doc = Object.assign({ ean: 0, name: "", price: 0, qty: 1, retail_price: 0, retail_qty: 0 }, doc)
                    doc.retail_qty = doc.price 

                    db.insert(doc, callback)
                }
            })
        }))
    }

    qtyItem(ean, inc = 1) {
        return this.getDb().then(db => new Promise((resolve, reject) => {
            db.update({ean}, { $inc: { qty: -1 }, $max: { qty: 0 }}, (err, res) => {
                if (err) return reject(err)
                resolve(res)
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
                    result[item.ean] = item
                    return result
                }, {}))
            })
        }))
    }
}