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

# change password
sudo echo "pi:$user_psk" | sudo chpasswd

# Setup WiFi
# read -p "SSID: " wifi_ssid
# read -p "Heslo: " wifi_psk
sudo wpa_passphrase "$wifi_ssid" "$wifi_psk" | sudo tee $WPA_SUPPLICANT > /dev/null
sudo ifdown wlan0 && sudo ifup wlan0

echo "Waiting for connection"
while [ 1 ]; do
	wget -q --spider https://github.com
	if [ $? -eq 0 ]; then
		break
	fi
	sleep 1
done
echo "Connection detected"

# enable ssh
sudo update-rc.d ssh enable && sudo invoke-rc.d ssh start

# change timezone
# sudo dpkg-reconfigure tzdata
sudo echo "Europe/Prague" | sudo tee /etc/timezone > /dev/null 
sudo dpkg-reconfigure -f noninteractive tzdata

# disable ipv6 for mdns
sudo echo "net.ipv6.conf.all.disable_ipv6 = 1" | sudo tee /etc/sysctl.conf > /dev/null
sudo sysctl -p
sudo ifdown wlan0 && sudo ifup wlan0

# install depedencies
sudo apt-get install -y libavahi-compat-libdnssd-dev python-pygame build-essential git

# install node
git clone https://github.com/audstanley/NodeJs-Raspberry-Pi
cd NodeJs-Raspberry-Pi
chmod +x Install-Node.sh
sudo ./Install-Node.sh
cd .. && rm -rf NodeJs-Raspberry-Pi/

# clone git repository
git clone "https://$git_user:$git_psk@github.com/delold/nwpos" nwpos

# fix permissions
sudo chown pi "$INSTALL_PATH/nwpos" -R

# install dependencies
cd "$INSTALL_PATH/nwpos/server"
npm install --production

# install forever / forever-service
sudo npm config set prefix /usr/local
sudo npm install -g forever forever-service

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