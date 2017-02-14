#!/bin/bash
INSTALL_PATH="/home/pi"

HOME="/home/$SUDO_USER"
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
WPA_SUPPLICANT=/etc/wpa_supplicant/wpa_supplicant.conf

if [ "$EUID" -ne 0 ]; then 
	echo "Please run as root"
	exit
fi

source "$DIR/config.txt"
cd $HOME

# change password
echo "pi:$user_psk" | chpasswd

# Setup WiFi
wpa_passphrase "$wifi_ssid" "$wifi_psk" | tee $WPA_SUPPLICANT > /dev/null
ifdown wlan0 && ifup wlan0

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
update-rc.d ssh enable && invoke-rc.d ssh start

# change timezone
echo "Europe/Prague" | tee /etc/timezone > /dev/null 
dpkg-reconfigure -f noninteractive tzdata

# disable ipv6 for mdns
echo "net.ipv6.conf.all.disable_ipv6 = 1" | tee /etc/sysctl.conf > /dev/null
sysctl -p
ifdown wlan0 && ifup wlan0

# add to group to print
gpasswd -a pi lp

# disable screen timeout
echo "BLANK_TIME=0" | tee /etc/kbd/config
echo "POWERDOWN_TIME=0" | tee -a /etc/kbd/config

# remove configuration settings
sed "/#<--config-->/,/#<--end-->/d" "$DIR/config.txt" | sudo tee "$DIR/config.txt"

# reboot device
reboot