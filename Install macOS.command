#!/bin/sh
cd "$(dirname "$0")" || exit 1
sh ./install-unix.sh
result=$?
echo 'Press Return to close.'
read -r reply
exit "$result"
