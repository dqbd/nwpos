apt-get update
apt-get install nodejs git -y
git clone "https://$git_user:$git_psk@github.com/delold/nwpos"

cp -a nwpos/server/* .
rm -rf nwpos

npm install --production
