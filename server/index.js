const config = require("./config")()
const os = require("os")
const minimist = require('minimist')
const http = require('http')
const url = require('url')
const WebSocket = require('ws')

let args = {
	port: 80,
	bonjour: true,
	dev: false,
	display: "",
	printer: (os.platform() === "win32") ? `\\\\${os.hostname()}\\nwcashier-printer` : "/dev/usb/lp0"
}

let boolean = ["dev", "bonjour"]

Object.keys(process.env)
	.filter(i => Object.keys(args).indexOf(i.toLowerCase().replace("nwpos_", "")) >= 0)
	.forEach((key) => {
		let param = key.toLowerCase().replace("nwpos_", "") 
		args[param] = boolean.indexOf(param) >= 0 ? process.env[key] == "true" : process.env[key]
	})

args = Object.assign(args, minimist(process.argv.slice(2), {boolean, default: args}))

const express = require("express")
const bodyParser = require("body-parser")
const multer = require("multer")
const path = require("path")

const bonjour = require('bonjour')()

const wss = new WebSocket.Server({ noServer: true })

const interface = require("./interface")(config, args, {
	broadcast: (data) => {
		wss.clients.forEach((ws) => {
			if (ws.readyState === WebSocket.OPEN) {
				ws.send(JSON.stringify(data))
			}
		})
	}
})

wss.on('connection', (ws) => {
	ws.on('message', (message) => {
		try {
			const { type, payload } = JSON.parse(message)
			if (type === 'ping') {
				ws.send(JSON.stringify({ type: 'pong', payload: null }))
			} else {
				Promise.resolve(interface.handleLiveSocket({ type, payload }))
					.then((data) => {
						if (data && ws.readyState === WebSocket.OPEN) {
							ws.send(JSON.stringify(data))
						}
					}, (err) => console.log(err))
			}
		} catch (err) {
			console.log(err.message)
		}
	})
})

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
	let attempts = 1
	let publish = () => {
		bonjour.publish({ name: advert, type: "http", port: args.port })
		.on("error", (err) => {
			attempts++
			console.log("Error: Service name is already in use on the network")
			setTimeout(publish, 5000 * attempts)
		})
	}
	publish()
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
					res.status(200).json(data)
				}
			})
			.catch(err => res.status(500).send(err))
		}

		app[method].apply(app, args === "file" ? ["/"+url, multer({dest: path.resolve(__dirname, "data")}).single(url), callback] : ["/"+url, callback])
	}
}

const server = http.createServer(app)
server.listen(args.port, (err) => {
	if (!err) {
		console.log("Listening on port", args.port)
	}
})

server.on('upgrade', (request, socket, head) => {
	const pathname = url.parse(request.url).pathname
	if (pathname === '/socket') {
		wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request)
    })
	} else {
		socket.destroy()
	}
})

process.on("SIGTERM", () => {
	interface.destroy()
	process.exit(0)
})