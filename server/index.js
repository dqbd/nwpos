const config = require("./config")()
const os = require("os")
const minimist = require('minimist')

let args = {
	port: 80,
	display: true,
	bonjour: true,
	dev: false,
	printer: (os.platform() === "win32") ? `\\\\${os.hostname()}\\nwcashier-printer` : "/dev/usb/lp0"
}

let boolean = ["display", "dev", "bonjour"]

Object.keys(process.env)
	.filter(i => Object.keys(args).indexOf(i.toLowerCase().replace("nwpos_", "")) >= 0)
	.forEach((key) => {
		let param = key.toLowerCase().replace("nwpos_", "") 
		args[param] = boolean.indexOf(param) >= 0 ? process.env[key] == "true" : process.env[key]
	})

args = Object.assign(args, minimist(process.argv.slice(2), {boolean, default: args}))
console.log(args)

const express = require("express")
const bodyParser = require("body-parser")
const multer = require("multer")
const path = require("path")

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

if (args.bonjour) {
	bonjour.publish({ name: advert, type: "http", port: args.port })
}

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

		app[method].apply(app, args === "file" ? ["/"+url, multer({dest: path.resolve(__dirname, "data")}).single(url), callback] : ["/"+url, callback])
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