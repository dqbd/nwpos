module.exports = {
    apps: [{
        name: "SERVER",
        script: "index.js",
        env: {
            "NWPOS_PORT": 85,
            "NWPOS_DISPLAY": false,
            "BONJOUR": false
        }
    }]
}