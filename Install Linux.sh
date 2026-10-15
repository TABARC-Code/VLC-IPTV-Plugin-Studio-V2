#!/bin/sh
# Run from any working directory; the installer resolves its own location.
source_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd) || exit 1
exec sh "$source_dir/install-unix.sh" "$@"
