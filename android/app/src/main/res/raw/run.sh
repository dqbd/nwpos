cd ./nwpos/server

pm2 start ecosystem.json --env android
pm2 start updater.js