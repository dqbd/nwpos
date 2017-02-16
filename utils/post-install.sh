#!/bin/bash
cd "/home/$SUDO_USER/nwpos/server"
export PATH="/home/$SUDO_USER/.yarn-global/bin:/home/$SUDO_USER/.yarn/bin:$PATH"
export PM2_HOME="/home/$SUDO_USER/.pm2"

yarn install --production
pm2 startOrRestart ecosystem.json