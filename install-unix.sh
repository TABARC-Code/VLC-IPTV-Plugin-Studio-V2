#!/bin/sh
# User-local installation needs no sudo. Keep the existing CSV on upgrades.
set -eu
source_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
# --data-dir is an explicit VLC user data directory (useful for portable profiles).
data_dir=
dry_run=false
while [ "$#" -gt 0 ]; do
  case "$1" in
    --data-dir)
      [ "$#" -ge 2 ] && [ -n "$2" ] || { printf '%s\n' '--data-dir needs an absolute directory.' >&2; exit 2; }
      data_dir=$2
      shift 2 ;;
    --dry-run) dry_run=true; shift ;;
    --help)
      printf '%s\n' 'Usage: sh install-unix.sh [--dry-run] [--data-dir /absolute/vlc-data-directory]' 'Defaults to the current account’s VLC data folder on macOS or Linux.'
      exit 0 ;;
    *) printf '%s\n' "Unknown option: $1" >&2; exit 2 ;;
  esac
done
case "$(uname -s)" in
  Darwin) default_data="$HOME/Library/Application Support/org.videolan.vlc" ;;
  Linux) default_data="${XDG_DATA_HOME:-$HOME/.local/share}/vlc" ;;
  *) printf '%s\n' 'This installer supports macOS and Linux. Use the Windows launcher on Windows.' >&2; exit 2 ;;
esac
data_dir=${data_dir:-$default_data}
case "$data_dir" in
  /*) ;;
  *) printf '%s\n' 'The VLC data directory must be an absolute path.' >&2; exit 2 ;;
esac
target="$data_dir/lua/extensions"
assets="$target/iptv-channel-player-assets"
if [ "$dry_run" = true ]; then
  printf '%s\n' "$target"
  exit 0
fi
# Verify the extracted package before changing an existing installation.
for required in iptv-channel-player.lua iptv-channel-player-assets/brand.png iptv-channel-player-assets/channels.csv README.md CSV_GUIDE.md IDIOTS_GUIDE.md; do
  [ -f "$source_dir/$required" ] || { printf '%s\n' "Missing package file: $required. Extract the complete release ZIP." >&2; exit 1; }
done
mkdir -p "$assets"
if [ -f "$target/iptv-channel-player.lua" ]; then
  backup="$target/iptv-channel-player.lua.backup-$(date +%Y%m%d%H%M%S)-$$"
  cp "$target/iptv-channel-player.lua" "$backup"
fi
cp "$source_dir/iptv-channel-player.lua" "$target/iptv-channel-player.lua"
cp "$source_dir/iptv-channel-player-assets/brand.png" "$assets/brand.png"
cp "$source_dir/README.md" "$assets/README.md"
for guide in CSV_GUIDE.md IDIOTS_GUIDE.md; do
  cp "$source_dir/$guide" "$assets/$guide"
done
if [ ! -e "$assets/channels.csv" ]; then
  cp "$source_dir/iptv-channel-player-assets/channels.csv" "$assets/channels.csv"
fi
printf '%s\n' 'Installed IPTV Channel Player V2 for your account.' 'Close and reopen VLC 3, then open its Extensions/View menu.' "Your CSV: $assets/channels.csv" 'Sample channels are disabled placeholders; replace the URLs before enabling them.'
