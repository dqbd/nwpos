#!/bin/bash
TOKEN="0b10415689d248e8059c327ccd0eec10add5990a"
HOME="/home/$SUDO_USER"
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

NWPOS_DIR="$HOME/nwpos"
SERVER_DIR="$NWPOS_DIR/server"

cd $HOME

# install server depedencies
apt-get update
apt-get install -y python-pygame git

# install node
git clone https://github.com/delold/NodeJs-Raspberry-Pi
cd NodeJs-Raspberry-Pi
chmod +x Install-Node.sh
./Install-Node.sh
cd .. && rm -rf NodeJs-Raspberry-Pi/

# install yarn for faster installs
curl -o- -L https://yarnpkg.com/install.sh | bash

# reload PATH
export PATH="$HOME/.yarn/bin:$PATH"

# configure yarn
mkdir -p .yarn-global/bin
yarn config set prefix "$HOME/.yarn-global"

# clone git repository
git clone "https://$TOKEN@github.com/delold/nwpos" "$NWPOS_DIR"

# install depedencies
cd "$SERVER_DIR"

# install forever / forever-service
yarn install --production
yarn global add pm2 --prefix "$HOME/.yarn-global"

# fix yarn permissions
chmod a+r -R /usr/local/share/.config/yarn/global/

# # reload PATH
export PATH="$HOME/.yarn-global/bin:$PATH"
EXPORT_BASHRC="export PATH=\"\$HOME/.yarn-global/bin:\$PATH\"" "$HOME/.bashrc"

if grep -Fxq "$EXPORT_BASHRC"; then
    echo "Path already set"
else
    echo "$EXPORT_BASHRC" >> "$HOME/.bashrc"
fi

# install service
pm2 startup systemd -u pi --hp "$HOME"

# setup git repository
cd "$NWPOS_DIR"
git config receive.denyCurrentBranch ignore

cp "$DIR/post-receive.sh" "$NWPOS_DIR/.git/hooks/post-receive"
chmod +x "$NWPOS_DIR/.git/hooks/post-receive"

# fix permissions
chown -R pi:pi "$NWPOS_DIR"

# start the service
cd "$SERVER_DIR"
PM2_HOME="$HOME/.pm2"

# start server & save its' state
sudo -u "$SUDO_USER" -E printenv PATH | pm2 start ecosystem.json
sudo -u "$SUDO_USER" -E printenv PATH | pm2 save

# fix pm2 permissions
chown -R pi:pi "$PM2_HOME"

echo "Install finished"