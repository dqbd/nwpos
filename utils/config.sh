#!/bin/bash
INSTALL_PATH="/home/pi"
WPA_SUPPLICANT=/etc/wpa_supplicant/wpa_supplicant.conf

pushd . > /dev/null
SCRIPT_PATH="${BASH_SOURCE[0]}";
while([ -h "${SCRIPT_PATH}" ]); do
	cd "`dirname "${SCRIPT_PATH}"`"
	SCRIPT_PATH="$(readlink "`basename "${SCRIPT_PATH}"`")";
done
cd "`dirname "${SCRIPT_PATH}"`" > /dev/null
SCRIPT_PATH="`pwd`";
popd > /dev/null

#home directory
cd $INSTALL_PATH
source "$SCRIPT_PATH/config.txt"

if [ "$EUID" -ne 0 ]
	then echo "Please run as root"
	exit
fi

# install depedencies
sudo apt-get update
sudo apt-get install -y python-pygame build-essential git

# install node
sudo git clone https://github.com/audstanley/NodeJs-Raspberry-Pi
sudo cd NodeJs-Raspberry-Pi
sudo chmod +x Install-Node.sh
sudo ./Install-Node.sh
sudo cd .. && rm -rf NodeJs-Raspberry-Pi/

# install yarn for faster installs
curl -o- -L https://yarnpkg.com/install.sh | sudo bash

# clone git repository
git clone "https://$git_user:$git_psk@github.com/delold/nwpos" nwpos

# fix permissions
sudo chown pi "$INSTALL_PATH/nwpos" -R

# install dependencies
cd "$INSTALL_PATH/nwpos/server"
~/.yarn/bin/yarn install --production

# install forever / forever-service
sudo ~/.yarn/bin/yarn global add forever forever-service --prefix /usr/local 

# install server
sudo forever-service install nwpos --script index.js

# setup git repository for continuous deployment
cd "$INSTALL_PATH/nwpos"
git config receive.denyCurrentBranch ignore

sudo mv "$SCRIPT_PATH/post-receive.sh" "$INSTALL_PATH/nwpos/.git/hooks/post-receive"
sudo chown pi "$INSTALL_PATH/nwpos/.git/hooks/post-receive"
sudo chmod +x "$INSTALL_PATH/nwpos/.git/hooks/post-receive"

#remove sensitive data from config.txt
sed "/#<--config-->/,/#<--end-->/d" "$SCRIPT_PATH/config.txt" | sudo tee "$SCRIPT_PATH/config.txt"
# sudo reboot