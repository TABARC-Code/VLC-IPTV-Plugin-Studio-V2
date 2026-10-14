#!/bin/sh
# User-local installation needs no sudo. Keep the existing CSV on upgrades.
set -eu
source_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
case "$(uname -s)" in
  Darwin) target="$HOME/Library/Application Support/org.videolan.vlc/lua/extensions" ;;
  *) target="${XDG_DATA_HOME:-$HOME/.local/share}/vlc/lua/extensions" ;;
esac
assets="$target/iptv-channel-player-assets"
mkdir -p "$assets"
if [ -f "$target/iptv-channel-player.lua" ]; then
  backup="$target/iptv-channel-player.lua.backup-$(date +%Y%m%d%H%M%S)-$$"
  cp "$target/iptv-channel-player.lua" "$backup"
fi
cp "$source_dir/iptv-channel-player.lua" "$target/iptv-channel-player.lua"
cp "$source_dir/iptv-channel-player-assets/brand.png" "$assets/brand.png"
cp "$source_dir/README.md" "$assets/README.md"
for guide in CSV_GUIDE.md AI_CSV_PROMPT.md IDIOTS_GUIDE.md; do
  cp "$source_dir/$guide" "$assets/$guide"
done
if [ ! -e "$assets/channels.csv" ]; then
  cp "$source_dir/iptv-channel-player-assets/channels.csv" "$assets/channels.csv"
fi
printf '%s\n' 'Installed IPTV Channel Player V2 for your account.' 'Close and reopen VLC 3, then open its Extensions/View menu.' "Your CSV: $assets/channels.csv" 'Sample channels are disabled placeholders; replace the URLs before enabling them.'
