const printer = require("./printer")

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

	let date = new Date()
	let dateString = "Datum: "
	dateString += ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"][date.getDay()] + " "
	dateString += ("0" + date.getDate()).slice(-2) + "."
	dateString += ("0" + (date.getMonth() + 1)).slice(-2) + "."
	dateString += date.getFullYear()

	dateString += "  " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2)

	expect(lines).toEqual([
		"Obchod u Růženky",
		"Ostravská 136/6",
		"748 01  HLUČÍN",
		"IČ: 43965547",
		"--------------------------------",
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
		dateString,
		"DĚKUJEME ZA VÁŠ NÁKUP"
	])
})