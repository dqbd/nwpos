jest.setMock('./native', require('./__mocks__/native'))

const print = require("./index.js")
const config = require("../eet/__mocks__/config")

 config.__mock = {
    sellers: [
        {
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
    ]
}

print.init(config, {printer: null})
print.printRaw = (lines) => Promise.resolve(lines)

test("print correct date", () => {
    let date = new Date(Date.parse("2017-01-06T15:50:19.283Z"))

    let customer = {
		status: "COMMIT_END",
		screen: -234,
		paid: 358,
		seller: "1212121218",
        date: date.toString(),
		services: {
			print: false,
			eet: false,
			log: false,
			working: false
		},
		cart: {
			selection: 1,
			items: [
				{ name: "", price: 123, qty: 1 },
				{ name: "", price: 1, qty: 1 }
			]
		}
    }

    return print.print(customer).then(lines => {
        expect(lines).toEqual([
            "$center",
            "Obchod",
            "Pod mostem 7",
            "748 01 OSTRAVA",
            "IČO: 1212121218",
            "DIČ: CZ1212121218",
            "--------------------------------",
            "$left",
            "Zboží       123.00  1 ks  123.00",
            "Zboží         1.00  1 ks    1.00",
            "================================",
            "CELKEM                    124.00",
            "HOTOVOST                  358.00",
            "VRÁCENO                   234.00",
            "--------------------------------",
            "Datum: Pá 06.01.2017    16:50:19",
            "DĚKUJEME ZA VÁŠ NÁKUP"
        ])
    })
})

test("print correct date with eet", () => {
    let customer = {
		status: "COMMIT_END",
		screen: -234,
		paid: 358,
		seller: "1212121218",
        date: new Date().toString(),
		services: {
			print: false,
			eet: {
                "uuid":"f8567ec6-5e5c-4547-9e97-84a0dceedf5a",
                "bkp":"0F2F1F2B-BF3B6315-FEE010E8-9C111F54-967A23F4",
                "date":"2017-02-04T20:15:21.000Z",
                "test":true,
                "fik":"7fe51d30-c1f0-4d07-8b6d-0c946ea4769c-ff",
                "warnings":[],
                "poradCis":"UrwfWNbQ#u92#/dtVyeg",
                "datTrzby":"2017-02-04T20:15:19.802Z"
            },
			log: false,
			working: false
		},
		cart: {
			selection: 1,
			items: [
				{ name: "", price: 123, qty: 1 },
				{ name: "", price: 1, qty: 1 }
			]
		}
    }

    return print.print(customer).then(lines => {
        expect(lines).toEqual([
            "$center",
            "Obchod",
            "Pod mostem 7",
            "748 01 OSTRAVA",
            "IČO: 1212121218",
            "DIČ: CZ1212121218",
            "--------------------------------",
            "$left",
            "Zboží       123.00  1 ks  123.00",
            "Zboží         1.00  1 ks    1.00",
            "================================",
            "CELKEM                    124.00",
            "HOTOVOST                  358.00",
            "VRÁCENO                   234.00",
            "--------------------------------",
            "Datum: So 04.02.2017    21:15:19",
            "DĚKUJEME ZA VÁŠ NÁKUP",
            "--------------------------------",
            "Provozovna: 123",
            "Pokladna: SiRLXKx1zv9EauXyWyyw",
            "Číslo účtenky: UrwfWNbQ#u92#/dtV",
            "yeg",
            "Režim tržby: běžný",
            "",
            "BKP: 0F2F1F2B-BF3B6315-FEE010E8-",
            "9C111F54-967A23F4",
            "FIK: 7fe51d30-c1f0-4d07-8b6d-0c9",
            "46ea4769c-ff"
        ])
    })
})