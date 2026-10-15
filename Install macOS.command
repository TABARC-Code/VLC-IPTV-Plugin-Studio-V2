#!/bin/sh
cd "$(dirname "$0")" || exit 1
sh ./install-unix.sh "$@"
result=$?
if [ -t 0 ]; then
  printf '%s\n' 'Press Return to close.'
  read -r reply
fi
exit "$result"
