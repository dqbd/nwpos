TOKEN="0b10415689d248e8059c327ccd0eec10add5990a"
apt-get update
apt-get install nodejs git openssl python2 openssl-tool -y
git clone "https://$TOKEN@github.com/delold/nwpos"

ls -l
cd ./nwpos/server
npm install --production
npm install -g pm2

pm2 start ecosystem.json --env android
pm2 start updater.js
pm2 save