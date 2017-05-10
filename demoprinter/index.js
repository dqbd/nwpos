const express = require("express")
const fs = require("fs")
const path = require("path")
const chokidar = require("chokidar")
const iconv = require("iconv-lite")

let app = express()

app.use("/", express.static(path.resolve(__dirname, "page")))

let server = require("http").createServer(app)
let io = require("socket.io")(server)


let printer = path.resolve(__dirname, "printer")

let codes = ['\x1b\x32', '\x1b\x33', '\x1b\x70\x00\x36\x36', '\x1b\x70\x01\x36\x36', '\x1d\x56\x00', '\x1d\x56\x01', '\x1d\x56\x41', '\x1d\x56\x42', '\x1b\x21\x00', '\x1b\x21\x10', '\x1b\x21\x20', '\x1b\x2d\x00', '\x1b\x2d\x01', '\x1b\x2d\x02', '\x1b\x45\x00', '\x1b\x45\x01', '\x1b\x4d\x00', '\x1b\x4d\x01', '\x1b\x4d\x02', '\x1b\x61\x00', '\x1b\x61\x01', '\x1b\x61\x02', '\x1b\x74\x00', '\x1b\x74\x36', '\x1b\x74\x48', '\x1b\x4d\x00', '\x1b\x4d\x01']

fs.writeFileSync(printer, "")

let time = -1

chokidar.watch(printer).on("all", (event) => {

    console.log("emiting event", event)

    let file = fs.readFileSync(printer)
    if (file.length > 0) {
        time = -1
    } else if (time == -1) {
        time = new Date().getTime()
    }

    while(file.length == 0 && time + 5000 > new Date().getTime()) {
        file = fs.readFileSync(printer)
    }

    let decoded = iconv.decode(file, "CP1250")
    console.log(file.length)

    codes.forEach((code) => {
        let regex = new RegExp(code, "g")
        if (['\x1b\x70\x00\x36\x36', '\x1b\x70\x01\x36\x36'].indexOf(code) >= 0) {
            decoded = decoded.replace(regex, "------ Otevírání pokladny ------")
        } else {
            decoded = decoded.replace(regex, "")
        }
    })
    
    if (decoded.trim().length > 0) {
        io.emit("print", decoded)
    }
})

io.on("connection", (client) => {
    console.log("connected")
    client.emit("test", "none")
})

console.log("Listening on port 1234")
server.listen(1234)

