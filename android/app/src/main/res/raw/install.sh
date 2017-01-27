git_user="$1"
git_psk="$2"

rm -rf ./*

apt-get update
apt-get install nodejs git jq -y
git clone "https://$git_user:$git_psk@github.com/delold/nwpos"

cp -a nwpos/server/* .
rm -rf nwpos

npm install --production

jq -c ".port = 8080" config.json > tmp.$$.json && mv tmp.$$.json config.json
