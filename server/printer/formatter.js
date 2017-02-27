const limit = 32
const alignRight = (left, right, spaces = 2) => {
	if (limit - left.length - right.length >= spaces) {
		return [left + " ".repeat(limit - left.length - right.length) + right]
	} else {
		return [left, right]
	}
}

const divider = (char = "-") => {
	return char.repeat(limit)
}

const datestamp = (date, weekday = true, divisor = "  ", dateString = "Datum: ") => {
	if (weekday) {
		dateString += ["Ne", "Po", "Út", "St", "Čt", "Pá", "So"][date.getDay()] + " "
	}
	dateString += ("0" + date.getDate()).slice(-2) + "."
	dateString += ("0" + (date.getMonth() + 1)).slice(-2) + "."
	dateString += date.getFullYear()
	dateString += divisor + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":" + ("0" + date.getSeconds()).slice(-2)

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
		let firstRow = limit - spacing * (row.length-1) - rest

		newRow += row[0].substring(0, firstRow)
		newRow += " ".repeat(firstRow - newRow.length)

		for(let x = 1; x < row.length; x++) {
			let column = row[x]

			newRow += " ".repeat(spacing + sizes[x] - column.length) + column
		}

		return newRow
	})
}

const wrapLine = (line) => {
	let lines = []
	for(let i = 0; i < line.length; i += limit) {
		while(line[i].trim().length == 0) i++
		lines.push(line.substring(i, Math.min(line.length, i + limit)).trim())
	} 
	return lines
}

module.exports.print = (lines) => {
	return lines.map(line => line.substring(0, limit))
}

module.exports.printCart = (items, total, paid, date, tax = 21) => {
	if (!date) {
		date = new Date()
	}

	let returned = -1 * (total - paid)

	body = table(items.map(item => [
		(item.name.length == 0) ? "Zboží" : item.name,
		item.price.toFixed(2),
		item.qty + " ks",
		(item.price * item.qty).toFixed(2)
	]))
	
	if (tax > 0) {
		body.push(divider())

		let taxed = (total / (100 + tax) * 100).toFixed(2)

		body.push(...alignRight(`Základ ${tax}% DPH`, taxed))
		body.push(...alignRight(`Daň`, (total - Number.parseFloat(taxed)).toFixed(2)))
	}

	body.push(divider("="))

	body.push(...alignRight("CELKEM", `${total}.00`))
	body.push(...alignRight("HOTOVOST", `${paid}.00`))
	body.push(...alignRight("VRÁCENO", `${returned}.00`))

	body.push(divider("-"))
	body.push(...alignRight.apply(this, datestamp(date).split("  ")))

	body.push("DĚKUJEME ZA VÁŠ NÁKUP")

	return body
}

module.exports.printEet = (eet, seller) => {
	if (eet === null || eet === undefined || eet === false || !eet.fik && !eet.pkp || !eet.bkp) return []

	let result = [
		divider("-"), 
		...alignRight("Provozovna: " + seller.eet.idProvoz, "Pokladna: " + seller.eet.idPokl),
		...wrapLine("Číslo účtenky: " + eet.poradCis)
	]

	if (eet.fik) {
		result = [...result, "Režim tržby: běžný"]
	} else if (eet.overeni && eet.err.message) {
		result = [...result, "Režim tržby: ověřovací", ...wrapLine(eet.err.message), "", ...wrapLine("Tržba NENÍ evidována v EET")]
	} else {
		result = [...result, "Režim tržby: zjednodušený"]
	}

	result = [...result, "", ...wrapLine("BKP: " + eet.bkp)]
	if (eet.fik) {
		result = [...result, ...wrapLine("FIK: " + eet.fik)]
	} else if (eet.pkp) {
		result = [...result, ...wrapLine("PKP: " + eet.pkp)]
	} 

	return result
}

module.exports.printHeader = (seller) => {
	let result = [
		seller.name,
		seller.street,
		`${seller.psc} ${seller.city.toUpperCase()}`,
		`IČO: ${seller.ic}`
	]

	if (seller.dic) {
		result.push(`DIČ: ${seller.dic}`)
	}

	result.push(divider())
	return result
} 