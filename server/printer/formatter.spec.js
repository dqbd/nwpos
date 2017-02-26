const printer = require("./formatter")


const getDateString = (date) => {
	let dateString = "Datum: "
	dateString += ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"][date.getDay()] + " "
	dateString += ("0" + date.getDate()).slice(-2) + "."
	dateString += ("0" + (date.getMonth() + 1)).slice(-2) + "."
	dateString += date.getFullYear()
	dateString += "  " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2)

	return dateString
}

test("print raw", () => {
	let lines = printer.print(["", "ČŘŽ", "--------------------------------truncated"])	
	expect(lines).toEqual([
		"",
		"ČŘŽ",
		"--------------------------------"
	])
})

test("print info", () => {
	let date = new Date(2016, 0, 30, 20, 10, 35, 50)

	let lines = printer.printCart([
		{ name: "Vejcovodovodní potrubí", price: 123, qty: 1 },
		{ name: "", price: 3500, qty: 2 },
		{ name: "Sleva", price: -350, qty: 2 },
	], 6423, 8000, date)

	expect(lines).toEqual([
		"Vejcovod   123.00  1 ks   123.00",
		"Zboží     3500.00  2 ks  7000.00",
		"Sleva     -350.00  2 ks  -700.00",
		"--------------------------------",
		"Základ 21% DPH           5308.26",
		"Daň                      1114.74",
		"================================",
		"CELKEM                   6423.00",
		"PLACENO                  8000.00",
		"VRÁCENO                  1577.00",
		"--------------------------------",
		"Datum: So 30.01.2016  20:10:35",
		"DĚKUJEME ZA VÁŠ NÁKUP"
	])
})
const seller = {
	"name": "Obchod",
	"ic": "123456789",
	"street": "Ostravská 136/6",
	"psc": "748 01",
	"dic": "CZ123456789",
	"city": "Hlučín",
	"eet": {
		"enabled": true,
		"file": "",
		"pass": "",
		"idPokl": "n/n_vT:GOJP,KuDVZPGX",
		"idProvoz": "123",
		"playground": true,
		"offline": true
	},
	"tax": false
}

test("print eet online", () => {
	let eet = {"uuid":"f8567ec6-5e5c-4547-9e97-84a0dceedf5a","bkp":"0F2F1F2B-BF3B6315-FEE010E8-9C111F54-967A23F4","date":"2017-02-04T20:15:21.000Z","test":true,"fik":"7fe51d30-c1f0-4d07-8b6d-0c946ea4769c-ff","warnings":[],"poradCis":"UrwfWNbQ#u92#/dtVyeg","datTrzby":"2017-02-04T20:15:19.802Z"}

	let lines = printer.printEet(eet, seller)
	expect(lines).toEqual([
		"",
		"Tržba evidována v běžném režimu",
		"",
		"Provozovna: 123",
   		"Pokladna: n/n_vT:GOJP,KuDVZPGX",
   		"",
   		"Číslo účtenky: UrwfWNbQ#u92#/dtV",
		"yeg",
		"Datum tržby: 04.02.2017 21:15:19",
   		"",
		"BKP: 0F2F1F2B-BF3B6315-FEE010E8-",
		"9C111F54-967A23F4",
		"FIK: 7fe51d30-c1f0-4d07-8b6d-0c9",
		"46ea4769c-ff"
	])
})

test("print eet null or invalid", () => {
	let eet = {"uuid":"f8567ec6-5e5c-4547-9e97-84a0dceedf5a"}
	let lines = printer.printEet(eet, seller)
	expect(lines).toEqual([])
})

test("print eet offline", () => {
	let eet = {"pkp":"D95b3JlYyVkP3kNEbb+jpvWqnSF3f5+7C5mW1Pf/xoJl3Mns1dIePNvRFmR9Pdtp8coVescPEjOYDy2binzk4vmkSazl8HZOOp1GEWrzb4vj5539OBp16TiIGTpI9jgEgtCW/ANNlSxNgCD2Zg/YL43I54zGvdOZuZRvFsdtTdn7wT2Hanlvn5ZIJmSYNDJen04uP+7Hlu5XKblc1Uzxi2HmPOD4/PWIKiU9dupSWIBLGny2ZzCHyt0NncSxOIPYLs7mCcFDk8qdmqbq8mv9oaV+l7z002UczAeZh058w9AX6CClxr7LMc4pPTQIhHL8AkX3Tm98LzrLWq9JS2vnYw==","bkp":"F923B375-DAE2ACFD-B67B9F5B-575A3292-5D7041A4","err":{"code":"ENOTFOUND","errno":"ENOTFOUND","syscall":"getaddrinfo","hostname":"pg.eet.cz","host":"pg.eet.cz","port":"443"},"poradCis":"3jY.S#7tqEFcCsW28cx3","datTrzby":"2017-02-04T20:45:45.696Z"}

	let lines = printer.printEet(eet, seller)
	expect(lines).toEqual([
		"",
		"Tržba evidována ve zjednodušeném",
		"režimu",
		"",
		"Provozovna: 123",
   		"Pokladna: n/n_vT:GOJP,KuDVZPGX",
   		"",
   		"Číslo účtenky: 3jY.S#7tqEFcCsW28",
   		"cx3",
		"Datum tržby: 04.02.2017 21:45:45",
   		"",
		"BKP: F923B375-DAE2ACFD-B67B9F5B-",
		"575A3292-5D7041A4",
		"PKP: D95b3JlYyVkP3kNEbb+jpvWqnSF",
		"3f5+7C5mW1Pf/xoJl3Mns1dIePNvRFmR",
		"9Pdtp8coVescPEjOYDy2binzk4vmkSaz",
		"l8HZOOp1GEWrzb4vj5539OBp16TiIGTp",
		"I9jgEgtCW/ANNlSxNgCD2Zg/YL43I54z",
		"GvdOZuZRvFsdtTdn7wT2Hanlvn5ZIJmS",
		"YNDJen04uP+7Hlu5XKblc1Uzxi2HmPOD",
		"4/PWIKiU9dupSWIBLGny2ZzCHyt0NncS",
		"xOIPYLs7mCcFDk8qdmqbq8mv9oaV+l7z",
		"002UczAeZh058w9AX6CClxr7LMc4pPTQ",
		"IhHL8AkX3Tm98LzrLWq9JS2vnYw=="
	])
})

test("print eet test", () => {
	let eet = {"pkp":"fU7tejtV0tFsoOZsNGae4S2UMaI2HYDpRb3toyzBWXyF8Zoe+3dNnuUJZ5ljYazvU5fegIQN+k5Eg1B5WZvaxsSChvxtwBzEn0VVLjeam5bXQlPuhwIP+ZRUGXpKdW/I9drFh6+4Ud7POaQCjCNRb+wX7S+5p4/2mA0vIlYQonvJk27daPdIbDsOweFCAQGSujo2NlBqg3cjL5zKyuhsTpYwiNWtVkAoMCDmbPQdd9PH5eV0ALVm0SwH0AoSHYds//LQGKQsYoVXffROpuaBJ5XhUnDkbvz0PlEcdQNQLqji7FOTzucDwiXZmaM1skM42ydhYSCplsawzizyZFoyyg==","bkp":"C6CFCCA8-17ACD4CF-B9FF974D-14CF5EB1-F7447354","err":{"message":"Datovou zpravu evidovane trzby v overovacim modu se podarilo zpracovat (0)"},"poradCis":"02222017182333672","datTrzby":"2017-02-22T17:23:33.672Z","overeni":true}

	let lines = printer.printEet(eet, seller)
	expect(lines).toEqual([
		"",
		"Ověřovací mód EET",
		"Datovou zpravu evidovane trzby v",
		"overovacim modu se podarilo zpra",
		"covat (0)",
		"",
		"Tržba NENÍ evidována v EET",
		"",
		"Provozovna: 123",
   		"Pokladna: n/n_vT:GOJP,KuDVZPGX",
   		"",
   		"Číslo účtenky: 02222017182333672",
		"Datum tržby: 22.02.2017 18:23:33",
   		"",
		"BKP: C6CFCCA8-17ACD4CF-B9FF974D-",
		"14CF5EB1-F7447354",
		"PKP: fU7tejtV0tFsoOZsNGae4S2UMaI",
		"2HYDpRb3toyzBWXyF8Zoe+3dNnuUJZ5l",
		"jYazvU5fegIQN+k5Eg1B5WZvaxsSChvx",
		"twBzEn0VVLjeam5bXQlPuhwIP+ZRUGXp",
		"KdW/I9drFh6+4Ud7POaQCjCNRb+wX7S+",
		"5p4/2mA0vIlYQonvJk27daPdIbDsOweF",
		"CAQGSujo2NlBqg3cjL5zKyuhsTpYwiNW",
		"tVkAoMCDmbPQdd9PH5eV0ALVm0SwH0Ao",
		"SHYds//LQGKQsYoVXffROpuaBJ5XhUnD",
		"kbvz0PlEcdQNQLqji7FOTzucDwiXZmaM",
		"1skM42ydhYSCplsawzizyZFoyyg=="
	])
})

test("print existing info", () => {
	let date = new Date(Date.parse("2017-01-06T15:50:19.283Z"))

	let lines = printer.printCart([
		{ name: "Vejcovodovodní potrubí", price: 123, qty: 1 },
		{ name: "", price: 3500, qty: 2 },
		{ name: "Sleva", price: -350, qty: 2 },
	], 6423, 8000, date)

	expect(lines).toEqual([
		"Vejcovod   123.00  1 ks   123.00",
		"Zboží     3500.00  2 ks  7000.00",
		"Sleva     -350.00  2 ks  -700.00",
		"--------------------------------",
		"Základ 21% DPH           5308.26",
		"Daň                      1114.74",
		"================================",
		"CELKEM                   6423.00",
		"PLACENO                  8000.00",
		"VRÁCENO                  1577.00",
		"--------------------------------",
		"Datum: Pá 06.01.2017  16:50:19",
		"DĚKUJEME ZA VÁŠ NÁKUP"
	])
})

test("print cart no tax", () => {
	let date = new Date(Date.parse("2017-01-06T15:50:19.283Z"))

	let lines = printer.printCart([
		{ name: "Vejcovodovodní potrubí", price: 123, qty: 1 },
		{ name: "", price: 3500, qty: 2 },
		{ name: "Sleva", price: -350, qty: 2 },
	], 6423, 8000, date, 0)

	expect(lines).toEqual([
		"Vejcovod   123.00  1 ks   123.00",
		"Zboží     3500.00  2 ks  7000.00",
		"Sleva     -350.00  2 ks  -700.00",
		"================================",
		"CELKEM                   6423.00",
		"PLACENO                  8000.00",
		"VRÁCENO                  1577.00",
		"--------------------------------",
		"Datum: Pá 06.01.2017  16:50:19",
		"DĚKUJEME ZA VÁŠ NÁKUP"
	])
})

test("print seller info", () => {
	let seller = {
		name: "Obchod",
		street: "Praha 123",
		ic: "123456789",
		psc: "748 01",
		city: "Hlučín"
	}

	expect(printer.printHeader(seller)).toEqual([
		"Obchod",
		"Praha 123",
		"748 01 HLUČÍN",
		"IČ: 123456789",
		"--------------------------------"
	])
})

test("print seller info with dic", () => {
	let seller = {
		name: "Obchod",
		street: "Praha 123",
		ic: "123456789",
		dic: "CZ123456789",
		psc: "748 01",
		city: "Hlučín"
	}

	expect(printer.printHeader(seller)).toEqual([
		"Obchod",
		"Praha 123",
		"748 01 HLUČÍN",
		"IČ: 123456789",
		"DIČ: CZ123456789",
		"--------------------------------"
	])
})