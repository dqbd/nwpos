jest.mock("fs")
const config = require("./index.js")
const fs = require("fs")

test("init, get & save", () => {
    fs.__setMockData({})
    let data = config()

    expect(data.get()).toEqual({
        sellers: []
    })

    expect(fs.__getMockData()).toEqual({
        "config.json": JSON.stringify({sellers: []})
    })
})

test("get default customer", () => {
    fs.__setMockData({
        "config.json": JSON.stringify({sellers: [{ic: "123456"}]})
    })

    let data = config()

    expect(data.get()).toEqual({
        sellers: [{
			name: null,
			ic: "123456",
			street: null,
			psc: null,
			dic: null,
			city: null,
			eet: {
				enabled: false,
				file: null,
				pass: null,
				idPokl: null,
				idProvoz: null,
				playground: true,
				offline: true
			},
			tax: false
		}]
    })
})