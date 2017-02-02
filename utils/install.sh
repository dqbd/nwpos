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

while [ 1 ]; do
	wget -q --spider http://archive.raspberrypi.org/
	if [ $? -eq 0 ]; then
		break
	fi
	sleep 1
done
echo "Connection detected"

# enable ssh
sudo update-rc.d ssh enable && sudo invoke-rc.d ssh start

# change timezone
sudo echo "Europe/Prague" | sudo tee /etc/timezone > /dev/null 
sudo dpkg-reconfigure -f noninteractive tzdata

# disable ipv6 for mdns
sudo echo "net.ipv6.conf.all.disable_ipv6 = 1" | sudo tee /etc/sysctl.conf > /dev/null
sudo sysctl -p
sudo ifdown wlan0 && sudo ifup wlan0