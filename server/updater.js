const fetch = require("node-fetch")
const pm2 = require("pm2")
const fs = require("fs")

let config = JSON.parse(fs.readFileSync("updater.example.json"))
try {
    config = Object.assign(config, JSON.parse(fs.readFileSync("updater.json")))
} catch (err) {}


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

let cached = {}
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
    let time = Math.floor(new Date().getTime() / 1000) 

    //clear any residues
    Object.keys(cached).forEach(id => {
        if (new Date().getTime() - cached[id] > 2 * 60 * 1000) { // 2 minute delay
            delete cached[id]
        } 
    })

    fetch(config.url + "?query=actions&id="+config.server_id+"&date="+(time - 15))
        .then(a => a.text())
        .then(res => {
            //we're 15s sooner... 
            payload = JSON.parse(res)
            payload.data.forEach(task => {
                if (cached[task.id] === undefined) {
                    cached[task.id] = Date.parse(task.date)

                    let args = JSON.parse(task.arguments)

                    args.push(function() {
                        send({
                            data: JSON.stringify(arguments),
                            process: { name: "UPDATER" }
                        })
                    })

                    pm2[task.action].apply(pm2, args)
                }
            })

            //delete if not broadcasted anymore
            Object.keys(cached).filter(id => !payload.data.find((task) => task.id === id)).forEach(id => {
                delete cached[id]
            })

            timer = setTimeout(poll.bind(this), 3000)
        }).catch(err => {
            console.error(err)
            timer = setTimeout(poll.bind(this), 3000)
        })
}
function watch() {
    console.log(config)
    
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
