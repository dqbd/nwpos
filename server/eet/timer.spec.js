jest.setMock('./certs', require('./__mocks__/certs'))

const config = require("./__mocks__/config")
const consts = require("./__mocks__/consts")
const logs = require("./__mocks__/logs")

const eet = require("eet")

const lib = require("./timer")
const timer = new lib(config, logs)

config.__mock = {
    sellers: [
        {ic: "123456", name: "first"},
        {
            "name": "Obchod",
            "ic": "789012",
            "dic": "CZ1212121218",
            "eet": {
                "enabled": true,
                "file": "CZ1212121218.P12",
                "pass": "eet",
                "idPokl": "SiRLXKx1zv9EauXyWyyw",
                "idProvoz": "123",
                "playground": true,
                "offline": true
            },
            "tax": false
        }
    ]
}

logs.__mocks = {
    "22.02.2017.db": {customers: [
        {
            "_id": "1",
            "returned": -80,
            "paid": 200,
            "cart": {
                "selection": 0,
                "items": [{ "name": "", "price": 120, "qty": 1}]
            }
        },
        {
            "returned": 0, "paid": 45,
            "cart": { "selection": 0, "items": [{ "name": "", "price": 45, "qty": 1 }] },
            "seller": "123456",
            "services": {
                "print": false,
                "eet": {
                    "uuid": "ebc0874a-be7a-4031-a780-b612ab74bd50",
                    "bkp": "E04D1098-7A890470-16300B86-FC6B6D6F-EB1B5B2F",
                    "date": "2017-02-19T19:43:25.000Z",
                    "test": true,
                    "fik": "2d805ec4-ed36-47d1-b01b-800925ca5f8f-ff",
                    "warnings": [],
                    "poradCis": "01922017204326434",
                    "datTrzby": "2017-02-19T19:43:26.434Z"
                },
                "log": false
            },
            "_id": "2"
        },
        {
            "returned": 0, "paid": 45,
            "cart": { "selection": 0, "items": [{ "name": "", "price": 45, "qty": 1 }] },
            "seller": "789012",
            "services": {
                "print": false,
                "eet": {
                    "uuid": "ebc0874a-be7a-4031-a780-b612ab74bd50",
                    "bkp": "E04D1098-7A890470-16300B86-FC6B6D6F-EB1B5B2F",
                    "date": "2017-02-19T19:43:25.000Z",
                    "test": true,
                    "err": true,
                    "pkp": "2d805ec4-ed36-47d1-b01b-800925ca5f8f-ff",
                    "poradCis": "01922017204326434",
                    "datTrzby": "2017-02-19T19:43:26.434Z"
                },
                "log": false
            },
            "_id": "3"
        },
        {
            "returned": 0, "paid": 45,
            "cart": { "selection": 0, "items": [{ "name": "", "price": 45, "qty": 1 }] },
            "seller": "789012",
            "services": {
                "print": false,
                "eet": {
                    "uuid": "ebc0874a-be7a-4031-a780-b612ab74bd50",
                    "bkp": "E04D1098-7A890470-16300B86-FC6B6D6F-EB1B5B2F",
                    "date": "2017-02-19T19:43:25.000Z",
                    "test": true,
                    "overeni": true,
                    "err": true,
                    "pkp": "2d805ec4-ed36-47d1-b01b-800925ca5f8f-ff",
                    "poradCis": "01922017204326434",
                    "datTrzby": "2017-02-19T19:43:26.434Z"
                },
                "log": false
            },
            "_id": "4"
        }
    ]}
}


test("get seller", () => {
    expect(timer.getSeller(null)).toEqual(config.__mock.sellers[0])
    expect(timer.getSeller("123")).toEqual(config.__mock.sellers[0])
    expect(timer.getSeller("123456")).toEqual(config.__mock.sellers[0])
    expect(timer.getSeller("789012")).toEqual(config.__mock.sellers[1])
})

test("retrieve failed logs correctly", () => {
    return timer.retrieveFailedLogs("22.02.2017").then((res) => {
        expect(res).toEqual([logs.__mocks["22.02.2017.db"].customers[2]])
    }).catch(err => expect(err).toBe(null))
    
})

test("resend log correctly", () => {
    return timer.resendLog([], logs.__mocks["22.02.2017.db"].customers[2]).then((data) => {
        expect(eet.__calls).toEqual([{
            options: {
                playground: true,
                offline: true,
                privateKey: consts.key,
                certificate: consts.cert,
                timeout: 3500
            },
            items: {
                dicPopl: 'CZ1212121218',
                idPokl: 'SiRLXKx1zv9EauXyWyyw',
                overeni: false,
                poradCis: '01922017204326434',
                datTrzby: new Date(Date.parse("2017-02-19T19:43:26.434Z")),
                celkTrzba: 45,
                idProvoz: '123'
            }
        }])
        expect(data).toEqual([{
            "returned": 0,
            "paid": 45,
            "cart": {
                "selection": 0,
                "items": [{
                    "name": "",
                    "price": 45,
                    "qty": 1
                }]
            },
            "seller": "789012",
            "services": {
                "print": false,
                "eet": {
                    "poradCis": "01922017204326434",
                    "datTrzby": new Date(Date.parse("2017-02-19T19:43:26.434Z"))
                },
                "log": false
            },
            "_id": "3"
        }])
    })
})