# Setup

Install desktop VLC 3 from https://www.videolan.org/vlc/. Extract the complete release ZIP, close VLC and run the installer for your operating system.

| System | Run this |
| --- | --- |
| Windows | Double-click Install Windows.cmd |
| macOS | Double-click Install macOS.command, or run sh install-unix.sh in Terminal |
| Linux | Open a terminal in the extracted folder and run sh install-unix.sh |

Restart VLC and open IPTV Channel Player V2 through View on Windows/Linux or the Extensions menu on macOS. The menu location depends on the build. No Python is required.

For manual installation, copy iptv-channel-player.lua and the complete iptv-channel-player-assets folder into your user extension directory. The usual paths are %APPDATA%\vlc\lua\extensions on Windows; ~/.local/share/vlc/lua/extensions or $XDG_DATA_HOME/vlc/lua/extensions on Linux; and ~/Library/Application Support/org.videolan.vlc/lua/extensions on macOS.

The installer preserves an existing CSV and backs up the previous extension script. Use your own local CSV path if you prefer another folder. Store or sandboxed VLC builds may use different paths or omit extension support.

Read [IDIOTS_GUIDE.md](IDIOTS_GUIDE.md) for the full first-channel walk-through and [CSV_GUIDE.md](CSV_GUIDE.md) for creating your list. If a launcher is blocked, review the files and use the manual steps instead of weakening system security settings.
