# Setup

Install desktop VLC 3 from https://www.videolan.org/vlc/. Extract the complete release ZIP, close VLC and run the installer for your operating system.

| System | Run this |
| --- | --- |
| Windows | Double-click Install Windows.cmd |
| macOS | Double-click Install macOS.command, or run sh install-unix.sh in Terminal |
| Linux | Open a terminal in the extracted folder and run `sh "Install Linux.sh"` |

Restart VLC and open IPTV Channel Player V2 through View on Windows/Linux or the Extensions menu on macOS. The menu location depends on the build. No Python is required.

For manual installation, copy iptv-channel-player.lua and the complete iptv-channel-player-assets folder into your user extension directory. The usual paths are %APPDATA%\vlc\lua\extensions on Windows; ~/.local/share/vlc/lua/extensions or $XDG_DATA_HOME/vlc/lua/extensions on Linux; and ~/Library/Application Support/org.videolan.vlc/lua/extensions on macOS.

The installer preserves an existing CSV and backs up the previous extension script. Use your own local CSV path if you prefer another folder. Store or sandboxed VLC builds may use different paths or omit extension support.

Read [IDIOTS_GUIDE.md](IDIOTS_GUIDE.md) for the full first-channel walk-through and [CSV_GUIDE.md](CSV_GUIDE.md) for creating your list. If a launcher is blocked, review the files and use the manual steps instead of weakening system security settings.

## Mac and Linux details

This is one shared Lua extension, so no separate Intel/Apple Silicon or Linux CPU build is needed. Install the correct desktop VLC 3 build for your operating system, then install this extension for your account.

On macOS, run Install macOS.command from the extracted ZIP. If the file does not launch, open Terminal in that directory and run `sh install-unix.sh`. The installer uses `~/Library/Application Support/org.videolan.vlc/lua/extensions/`; it does not alter VLC.app.

On Linux, run `sh "Install Linux.sh"` in the extracted directory. The default is `~/.local/share/vlc/lua/extensions/`. An absolute XDG_DATA_HOME changes this to `$XDG_DATA_HOME/vlc/lua/extensions/`. A terminal is the reliable route because file managers handle shell launchers differently.

`sh install-unix.sh --dry-run` prints the destination without changing files. For a portable or sandboxed build whose VLC data directory you have established, use `sh install-unix.sh --data-dir "/absolute/path/to/vlc-data"`. The installer appends `lua/extensions`; do not pass the extensions directory itself. This option does not reconfigure VLC, grant sandbox permissions or establish that the build supports extensions. Flatpak/Snap/store variants need their own path and host checks.

The Mac and Linux installers are checked in CI on their respective operating systems. Graphical discovery, layout and stream playback are separate desktop checks; see VALIDATION.md.
