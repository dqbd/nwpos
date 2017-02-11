module.exports = {
    apps: [{
        name: "SERVER",
        script: "index.js",
        env: {
            "NWPOS_PORT": 80,
            "NWPOS_DISPLAY": true,
            "BONJOUR": true
        },
        env_dev: {
            "NWPOS_PORT": 81,
            "NWPOS_DEV": true,
            "NWPOS_DISPLAY": false,
            "BONJOUR": false
        }
    }]
}