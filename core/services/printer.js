const limit = 32
const alignRight = (left, right) => {
	return left + " ".repeat(32 - left.length - right.length) + right
}

const divider = (char = "-") => {
	return char.repeat(32)
}

const datestamp = () => {
	let date = new Date()
	let dateString = "Datum: "
	dateString += ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"][date.getDay()] + " "
	dateString += ("0" + date.getDate()).slice(-2) + "."
	dateString += ("0" + (date.getMonth() + 1)).slice(-2) + "."
	dateString += date.getFullYear()
	dateString += "  " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2)

	return dateString
}

const table = (rows, spacing = 2) => {
	//determine size of rows
	let sizes = {}
	rows.forEach(row => {
		for(let x = 1; x < row.length; x++) {
			if (sizes[x] === undefined) {
				sizes[x] = 0
			}

			sizes[x] = Math.max(sizes[x], row[x].length)
		}
	})

	return rows.map((row) => {
		let newRow = ""

		//first row unimportant, truncate
		let rest = Object.keys(sizes).reduce((memo, a) => memo + sizes[a], 0)
		let firstRow = 32 - spacing * (row.length-1) - rest

		newRow += row[0].substring(0, firstRow)
		newRow += " ".repeat(firstRow - newRow.length)

		for(let x = 1; x < row.length; x++) {
			let column = row[x]

			newRow += " ".repeat(spacing + sizes[x] - column.length) + column
		}

		return newRow
	})
}

module.exports.print = (lines) => {
	return lines.map(line => line.substring(0, 32))
}

module.exports.printCart = (items, total, paid, tax = 21) => {
	let body = [
		"Obchod u Růženky",
		"Ostravská 136/6",
		"748 01  HLUČÍN",
		"IČ: 43965547",
		divider()
	]

	let returned = -1 * (total - paid)

	body = [...body, ...table(items.map(item => [
		(item.name.length == 0) ? "Zboží" : item.name,
		item.price.toFixed(2),
		item.qty + " ks",
		(item.price * item.qty).toFixed(2)
	]))]

	body.push(divider())

	let taxed = (total / (100 + tax) * 100).toFixed(2)

	body.push(alignRight(`Základ ${tax}% DPH`, taxed))
	body.push(alignRight(`Daň`, (total - Number.parseFloat(taxed)).toFixed(2)))

	body.push(divider("="))

	body.push(alignRight("CELKEM", `${total}.00`))
	body.push(alignRight("PLACENO", `${paid}.00`))
	body.push(alignRight("VRÁCENO", `${returned}.00`))

	body.push(divider("-"))
	body.push(datestamp())

	body.push("DĚKUJEME ZA VÁŠ NÁKUP")

	return body
}