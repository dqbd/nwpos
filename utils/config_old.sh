#!/bin/bash
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

# if [ "$EUID" -ne 0 ]
# 	then echo "Please run as root"
# 	exit
# fi

# install depedencies
sudo apt-get update
sudo apt-get install -y python-pygame git

# install node
# sudo git clone https://github.com/audstanley/NodeJs-Raspberry-Pi
# sudo cd NodeJs-Raspberry-Pi
# sudo chmod +x Install-Node.sh
# sudo ./Install-Node.sh
# sudo cd .. && rm -rf NodeJs-Raspberry-Pi/

# install yarn for faster installs
curl -o- -L https://yarnpkg.com/install.sh | bash

# configure yarn
eval "mkdir $INSTALL_PATH/.yarn-global"
eval "mkdir $INSTALL_PATH/.yarn-global/bin"
eval "$INSTALL_PATH/.yarn/bin/yarn config set prefix $INSTALL_PATH/.yarn-global"

# clone git repository

ssh-keygen -F github.com 2>/dev/null 1>/dev/null
if ! [ $? -eq 0 ]; then
    ssh-keyscan -t rsa github.com > "$INSTALL_PATH/github.pub"
    if ! ssh-keygen -lf "$INSTALL_PATH/github.pub" | grep -q "16:27:ac:a5:76:28:2d:36:63:1b:56:4d:eb:df:a6:48"; then
        rm "$INSTALL_PATH/github.pub"
        echo "Fingerprint mismatching"
        exit 2
    fi

    cat "$INSTALL_PATH/github.pub" >> "$INSTALL_PATH/.ssh/known_hosts"
    ssh-keygen -Hf "$INSTALL_PATH/.ssh/known_hosts"
    
    rm "$INSTALL_PATH/github.pub"
fi

chmod 500 "$SCRIPT_PATH/deploy_rsa"
ssh-agent bash -c "ssh-add $SCRIPT_PATH/deploy_rsa; git clone git@github.com:delold/nwpos $INSTALL_PATH/nwpos"

# install dependencies
cd "$INSTALL_PATH/nwpos/server"

# install depedencies
eval "$INSTALL_PATH/.yarn/bin/yarn install --production"

# install forever / forever-service
eval "$INSTALL_PATH/.yarn/bin/yarn global add pm2 --prefix /usr/local"

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