#!/bin/bash
pushd . > /dev/null
SCRIPT_PATH="${BASH_SOURCE[0]}";
while([ -h "${SCRIPT_PATH}" ]); do
	cd "`dirname "${SCRIPT_PATH}"`"
	SCRIPT_PATH="$(readlink "`basename "${SCRIPT_PATH}"`")";
done
cd "`dirname "${SCRIPT_PATH}"`" > /dev/null
SCRIPT_PATH="`pwd`";
popd > /dev/null

if [ "$EUID" -ne 0 ]
	then echo "Please run as root"
	exit
fi

sudo bash "$SCRIPT_PATH/install.sh"

echo "test waiting"
sleep 60

sudo bash "$SCRIPT_PATH/config.sh"

