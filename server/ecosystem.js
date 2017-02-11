module.exports = {
    apps: [{
        name: "SERVER",
        script: "index.js",
        env: {
            "NWPOS_PORT": 8080,
            "NWPOS_DISPLAY": true,
            "BONJOUR": true
        },
        env_dev: {
            "NWPOS_PORT": 81,
            "NWPOS_DEV": true,
            "NWPOS_DISPLAY": false,
            "BONJOUR": false
        }
    }],
    deploy: {
        rpi: {
            "user": "pi",
            "repo": "git@github.com:delold/nwpos.git",
            "path": "/home/pi/nwpos",
            "ssh_options": "StrictHostKeyChecking=no",
            "pre-setup": "apt-get install python-pygame git",
            "post-deploy": "pm2 startOrRestart ecosystem.json", 
            "env": {
                "NWPOS_PORT": 8080,
                "NWPOS_DISPLAY": true,
                "BONJOUR": true
            }
        }
    }
}