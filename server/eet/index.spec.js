jest.setMock('./certs', require('./__mocks__/certs'))

const index = require("./index")
const consts = require("./__mocks__/consts")
const eet = require("eet")

const seller = {
    "name": "Obchod",
    "ic": "1212121218",
    "street": "Pod mostem 7",
    "psc": "748 01",
    "dic": "CZ1212121218",
    "city": "Ostrava",
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

test("send eet correctly", () => {
    let total = 100
    let poradCislo = "123456"
    let now = new Date()
 
    index.upload(seller, total, poradCislo, now).then(data => {
        expect(eet.__calls).toEqual([{
            options: {
                "enabled": true,
                "file": "CZ1212121218.P12",
                "pass": "eet",
                "idPokl": "SiRLXKx1zv9EauXyWyyw",
                "idProvoz": "123",
                "playground": true,
                "offline": true,
                "privateKey": consts.key,
                "certificate": consts.cert,
                "dic": "CZ1212121218"
            },
            items: {
                dicPopl: 'CZ1212121218',
                idPokl: 'SiRLXKx1zv9EauXyWyyw',
                poradCis: '123456',
                datTrzby: now,
                celkTrzba: 100,
                idProvoz: '123'
            }
        }])    
    })

})