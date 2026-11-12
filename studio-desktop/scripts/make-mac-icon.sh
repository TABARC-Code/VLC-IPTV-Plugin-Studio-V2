#!/bin/sh
set -eu

if [ "$(uname -s)" != "Darwin" ]; then
  echo "This icon build requires macOS." >&2
  exit 1
fi

project="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
source="$project/assets/icon.png"
destination="$project/assets/icon.icns"
scratch="$(mktemp -d)"
trap 'rm -rf "$scratch"' EXIT HUP INT TERM
iconset="$scratch/TABARC.iconset"
mkdir -p "$iconset"

# Start with the supplied icon. No replacement artwork.
for size in 16 32 128 256 512; do
  sips -z "$size" "$size" "$source" --out "$iconset/icon_${size}x${size}.png" >/dev/null
  doubled=$((size * 2))
  sips -z "$doubled" "$doubled" "$source" --out "$iconset/icon_${size}x${size}@2x.png" >/dev/null
done

iconutil -c icns "$iconset" -o "$destination"
test -s "$destination"
