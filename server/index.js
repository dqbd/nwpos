const config = require("./config")()
const os = require("os")

const args = require('minimist')(process.argv.slice(2), { 
	default: {
		port: 80,
		display: false,
		dev: false,
		printer: (os.platform() === "win32") ? `\\\\${os.hostname()}\\nwcashier-printer` : "/dev/usb/lp0"
	},
	boolean: ["display", "dev"]
})

const express = require("express")
const bodyParser = require("body-parser")
const multer = require("multer")


const bonjour = require('bonjour')()
const interface = require("./interface")(config, args)

const app = express()
let advert = "nodecashier-service"
if (args.dev) {
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

//disable caching
app.disable('etag')
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
		let callback = (req, res) => {
			let params = req.query
			if (method === "post") params = req.body
			if (args === "file") params = Object.assign(params, {file: req.file})

			interface[name](params)
			.then(data => {
				if (args === "pipe") {
					data.pipe(res)
				} else {
					res.status(200).send(data)
				}
			})
			.catch(err => res.status(500).send(err))
		}

		app[method].apply(app, args === "file" ? ["/"+url, multer({dest: "./data"}).single(url), callback] : ["/"+url, callback])
	}
}

app.listen(args.port, (err, port) => {
	if (!err) {
		console.log("Listening on port", args.port)
	}
})

process.on("SIGTERM", () => {
	interface.destroy()
	process.exit(0)
})