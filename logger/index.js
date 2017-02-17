const pm2 = require("pm2")
pm2.connect((err) => {
    if (err) {
        console.error(err)
        process.exit(2)
    }

    pm2.launchBus((err, bus) => {
        if (err) {
            console.error(err)
        }

        bus.on("log:*", function(type, event) {
            console.log(event)
        })
    })
})