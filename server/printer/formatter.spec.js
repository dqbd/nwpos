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
	let lines = printer.printCart([
		{ name: "Vejcovodovodní potrubí", price: 123, qty: 1 },
		{ name: "", price: 3500, qty: 2 },
		{ name: "Sleva", price: -350, qty: 2 },
	], 6423, 8000)

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
		getDateString(new Date()),
		"DĚKUJEME ZA VÁŠ NÁKUP"
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
		getDateString(date),
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