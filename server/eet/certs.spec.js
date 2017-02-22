const fs = require("fs")
const path = require("path")
const certs = require("./certs")

const consts = require("./__mocks__/consts")

certs.getCertFile = (filename) => {
    return path.resolve(__dirname, "__certs__", filename)
}

certs.deleteCert = jest.fn()

test("get private keys", () => {
    return certs.retrieveCert("CZ1212121218.p12", "eet").then(keys => {
        expect(keys).toEqual({ ca: [consts.ca], cert: consts.cert, key: consts.key })
    }).catch(err => {
        expect(err).toBe(null)
    })
})

test("validate cert wrong", () => {
    return certs.validateCert("CZ1212121218.p12", "eet").then(data => {
        expect(data).toEqual({ filename: "CZ1212121218.p12" })
    })
})

test("validate cert correct", () => {
    return certs.validateCert("CZ1212121218.p12", "wrong").then(data => {
        expect(data).toBe(false)
    }).catch(err => {
        expect(certs.deleteCert.mock.calls.length).toBe(1)
        expect(err).toEqual(false)
    })
})