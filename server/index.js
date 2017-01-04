const express = require("express")
const path = require("path")
const mdns = require("mdns")
const bodyParser = require("body-parser")

const database = require("./database") 
const escpos = require("./printer/printer")
const customer = require("./customer")

const app = express()

customer.init()

let printer = null
try {
	let device = null
	if (/^win/.test(process.platform)) {
		const usb = require("./printer/usb")
		device = new usb()
	} else {
		const serial = require("./printer/serial")
		device = new serial("/dev/usb/lp0")
	}

	device.open(() => printer = new escpos(device))
} catch (err) { console.error("Printer not found") }

let advert = "nodecashier-services"
if (process.argv[2] === "--dev") {
	const webpack = require("webpack")
	let compiler = webpack(require("../webpack.dev.config.js"))
	app.use("/", require("webpack-dev-middleware")(compiler, { noInfo: true, stats: { colors: true } }))
	app.use("/", require("webpack-hot-middleware")(compiler))
	advert += "-dev"

} else {
	const path = require("path")
	app.use("/", express.static(path.resolve(__dirname, "dist")))
}

mdns.createAdvertisement(mdns.tcp("http"), 80, { name: advert }, (error, service) => {
	if (!error) {
		console.log("MDNS started: " + advert)
	}
}).start()

app.use(bodyParser.json())
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*")
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
	next()
})

app.post("/print", (req, res) => {
	if (req.body !== undefined && req.body.lines !== undefined) {

		if (printer !== null) {
			req.body.lines.forEach((line) => {
				printer.text(line)
			})

			printer.feed()

			return res.sendStatus(200)
		} else {
			console.log("Printer not ready")
		}
	} else {
		console.log("Invalid request")
	}

	res.sendStatus(500)
})

app.get("/suggest", (req, res) => {
	database.suggestion().getGrouped().then(data => {
		res.status(200).send(JSON.stringify(data))	
	}).catch(err => {
		res.status(500).send(JSON.stringify(err))
	})
})

app.post("/suggest", (req, res) => {
	if (req.body !== undefined && req.body.price !== undefined) {
		database.suggestion().suggest(Number.parseFloat(req.body.price)).then(data => {
			res.status(200).send(JSON.stringify(data))
		}).catch(err => {
			res.status(500).send(JSON.stringify(err))
		}) 
	} else {
		res.sendStatus(500)
	}
})

app.post("/stream", (req, res) => {
	if (req.body !== undefined && req.body.customer !== undefined) {
		customer.set(req.body.customer)
		res.status(200).send(req.body.customer)
	} else {
		res.status(500).send("No customer")
	}
})

app.post("/store", (req, res) => {
	if (req.body !== undefined && req.body.customer !== undefined) {
		let customer = req.body.customer
		customer.date = new Date()

		database.logs().logCustomer(customer)

		Promise.all(customer.cart.items.map(item => {
			return database.suggestion().updateSuggestion(item["name"], item["price"])
		}))
		.then(a => database.suggestion().getGrouped())
		.then(a => {
			res.status(200).send(JSON.stringify(a))
		}).catch(e => {
			res.status(500).send(e)
		})
	} else {
		res.sendStatus(500)
	}
})

app.get("/logs", (req, res) => {
	database.logs().retrieveLogs().then(a => {
		res.status(200).send(JSON.stringify(a))
	}).catch(err => {
		console.log(err)
		res.status(500).send(err)
	})
})

app.post("/eet", (req, res) => {
	res.sendStatus(500)
})

app.listen(80, (err, port) => {
	if (!err) {
		console.log("Listening on port", 80)
	}
})