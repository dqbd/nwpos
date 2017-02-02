const config = require("./config")()

const express = require("express")
const bodyParser = require("body-parser")

const bonjour = require('bonjour')()
const interface = require("./interface")(config)

const app = express()

let advert = "nodecashier-service"
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

bonjour.publish({ name: advert, type: "http", port: config.get().port })

app.use(bodyParser.json())
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*")
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
	next()
})

//apply functions
for(let name of Object.getOwnPropertyNames(Object.getPrototypeOf(interface))) {
	let [method, url, args] = name.toLowerCase().split("_")
	if (url) {
		app[method]("/"+url, (req, res) => {
			interface[name](method === "post" ? req.body : req.query)
			.then(data => args === "pipe" ? data.pipe(res) : res.status(200).send(data))
			.catch(err => res.status(500).send(err))
		})
	}
}

app.listen(config.get().port, (err, port) => {
	if (!err) {
		console.log("Listening on port", config.get().port)
	}
})

process.on("SIGTERM", () => {
	interface.destroy()
	process.exit(0)
})