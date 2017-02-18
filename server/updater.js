const fetch = require("node-fetch")
const pm2 = require("pm2")
const fs = require("fs")

let config = JSON.parse(fs.readFileSync("updater.example.json"))
try {
    config = Object.assign(config, JSON.parse(fs.readFileSync("updater.json")))
} catch (err) {}


console.log(config.url)
if (!config.server_id) {
    fetch(config.url + "?query=generate")
        .then(a => a.json())
        .then(res => {
            config.server_id = res["data"]
            fs.writeFileSync("updater.json", JSON.stringify(config))
            watch()
        })
} else {
    watch()
}

let timer = null
let promise = Promise.resolve(true)

function send(event) {
    promise.then(fetch(config.url+"?query=log&id="+config.server_id, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event)
    }))
}

function poll() {
    clearTimeout(timer)

    let time = Math.floor(new Date().getTime() / 1000) - 15
    fetch(config.url + "?query=actions&id="+config.server_id+"&date="+time)
        .then(a => a.text())
        .then(res => {
            console.log(time, res)
            JSON.parse(res).data.forEach(task => {
                let args = JSON.parse(task.arguments)
                
                args.push(function() {
                    send({
                        data: JSON.stringify(arguments),
                        process: { name: "UPDATER" }
                    })
                })

                console.log(pm2[task.action])
                pm2[task.action].apply(pm2, args)
            })
            timer = setTimeout(poll.bind(this), 3000)
        })
}
function watch() {
    pm2.connect((err) => {
        if (err) {
            console.error(err)
            process.exit(2)
        }

        poll()

        pm2.launchBus((err, bus) => {
            if (err) return console.error(err)
            
            bus.on("log:*", (type, event) => {
                send(event)
            })
        })
    })
}
