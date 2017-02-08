git_user="$1"
git_psk="$2"

apt-get update
apt-get install nodejs git openssl openssl-tool -y
git clone "https://$git_user:$git_psk@github.com/delold/nwpos"

ls -l
cd ./nwpos/server
npm install --production