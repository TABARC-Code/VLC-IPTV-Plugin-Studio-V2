# IPTV Channel Player V2

**TABARC-Code · v1.5.2 · a native VLC Lua extension**

This version opens inside VLC. It reads your channel CSV, lets you search or choose a group, and plays a selected stream using VLC's own player. Queue buttons add channels to the existing playlist. Python is not required to install or run this extension.

I have kept the channel database separate from the code. Editing a television channel should take one spreadsheet row, not a small archaeological expedition through a script.

## Guides

[Complete beginner](IDIOTS_GUIDE.md) · [CSV from scratch](CSV_GUIDE.md) · [User guide](USER_GUIDE.md) · [Setup](SETUP.md) · [FAQ](FAQ.md) · [Roadmap](ROADMAP.md) · [Developer guide](DEVELOPER_GUIDE.md)

## Reusable sources and licences

[IPTV-list links](IPTV-SOURCES.md) · [Third-party notices and icon licences](THIRD_PARTY_NOTICES.md). The lists have a published repository licence; broadcast rights still need checking.

## Install: start here

You need **desktop VLC 3**, with its Lua extensions enabled. Download VLC from https://www.videolan.org/vlc/ if necessary. This package targets the standard desktop interfaces on Windows, Linux and macOS. Store, sandboxed and Flatpak builds may use different paths or omit extension support. Mobile VLC is not supported; VLC 4 has not been verified.

1. Extract the whole ZIP into a folder. Do not run the installer from the ZIP preview.
2. Close VLC.
3. On Windows, double-click **Install Windows.cmd**. It runs the supplied PowerShell installer for your account, without changing the machine-wide script policy. On macOS, double-click **Install macOS.command**, or open Terminal in the extracted folder and run `sh install-unix.sh`. On Linux, open a terminal in the extracted folder and run `sh "Install Linux.sh"`. Both systems also accept `sh install-unix.sh`.
4. Open VLC again. On Windows and Linux, choose **View → IPTV Channel Player V2**. On macOS, look in VLC's **Extensions** menu for the same entry; the exact menu location depends on the build.

The installer prints where it put your CSV. It preserves an existing CSV on updates and backs up the previous extension script. No administrator account is needed for a normal user-local installation.

If a launcher cannot run, use the manual steps below. Avoid disabling system security controls for an unfamiliar download.

### Mac and Linux installation

The same ZIP and Lua extension serve Windows, macOS and Linux. Download the VLC build appropriate to your computer; the extension itself contains no architecture-specific binary.

- **Mac:** extract the ZIP, close VLC and open **Install macOS.command**. Terminal fallback: `sh install-unix.sh` from the extracted folder. Reopen VLC and look in its Extensions menu.
- **Linux:** extract the ZIP, close VLC and run `sh "Install Linux.sh"` from the extracted folder. Reopen VLC and choose View > IPTV Channel Player V2.

Run `sh install-unix.sh --dry-run` to print the destination without installing. The installer uses your account's VLC data folder and preserves your CSV on upgrades. Advanced installations can pass `--data-dir /absolute/path/to/vlc-data`; that must be the data directory used by the selected VLC build. The option does not configure VLC itself. Flatpak/Snap/store installations are not automatically detected.

CI checks the installer on both macOS and Linux. These checks cover files, paths and upgrades; they do not exercise the graphical VLC interface or stream playback. See [SETUP.md](SETUP.md) and [VALIDATION.md](VALIDATION.md).


## Play your first channel

The extension opens with a CSV path already filled in. A fresh installation includes four **disabled placeholder channels**. There are no subscriptions or working feeds bundled with the package.

Open that CSV in Excel or LibreOffice. Replace a placeholder stream_url with an actual stream you are authorised to use, and set its enabled cell to true. Save as **UTF-8 CSV**, keeping the header. A normal broadcaster webpage is usually not a stream URL.

Back in VLC, choose **Load / Reload CSV**, select one enabled channel in the list, then **Play selected**. VLC handles volume, pause, video, subtitles and full-screen viewing. The extension's status confirms the hand-off to VLC; it does not claim the provider's stream has started successfully.

You can use another CSV instead: copy its full local path into the CSV field. Windows' Copy as path may include quotation marks; those are accepted. The extension remembers the last CSV filename in your VLC configuration folder.

## Search, queue and export

Type a search, choose a group, or tick Show disabled, then choose **Apply filter**. Search covers names, groups, countries and languages using simple case folding. Disabled records are marked and cannot be played from the extension.

**Queue selected** adds your selected enabled channels without starting them. **Queue filtered** adds enabled records matching the current search, group and audience settings. These actions append to the current VLC playlist; they do not clear it. Repeated clicks intentionally add another copy.

For another IPTV app, enter a local filename ending in .m3u or .m3u8 and choose **Export M3U**. Export uses enabled rows matching the current filters, including matches beyond the 1,000-row display cap. If the output already exists, the extension asks for a second click and keeps the old file under a .backup name. Keep those backups private too if the URLs contain access tokens.

The list displays at most 1,000 matching rows; refine the filter to reach a particular channel. CSV input is limited to 2 MiB and 20,000 records so a huge list does not pin the extension UI indefinitely.

## Audience and XXX visibility

Choose one audience from the dropdown: **Show all**, **Cartoons**, **12+**, **16+**, **18+**, **XXX** or **Unrated**. Tick **Show XXX** to include channels labelled XXX, then choose **Apply filter**. XXX is hidden whenever you open the extension. Show all includes every audience except XXX while that checkbox is off.

These are exact categories: 12+ selects the 12+ label; it does not include other ages. 18+ and XXX are separate. The labels come from your CSV, are not verified ratings and do not establish whether a channel is suitable for children. Cartoons can include adult animation. This is a list filter, not a PIN lock; it does not stop current playback or remove items already queued in VLC.

The easiest setup uses the existing `group` column: Cartoons, Animation, 12+, 16+, 18+, XXX, Adult and Adult (XXX) are recognised as complete group names, ignoring case and surrounding spaces. Other groups are Unrated. To keep your own groups, add the optional `audience` column instead and enter `cartoons`, `12+`, `16+`, `18+`, `xxx` or `unrated`. Explicit labels override the group; a blank cell uses the group fallback. No classification is guessed from channel names.

Start with [examples/audience-categories.csv](examples/audience-categories.csv); all its streams are disabled placeholders. Label adult animation 18+ or XXX as appropriate, keeping Cartoons as its group for group filtering. **Queue filtered** and **Export M3U** use the current controls even before you press Apply filter. Selected playback and queueing also check the current filters again.

## CSV layout

Use the exact header below. All nine original columns must exist; optional cells can be empty. An optional tenth column, `audience`, enables explicit audience labels. Existing nine-column files still work.

```csv
id,name,group,country,language,stream_url,logo_url,tvg_id,enabled
news-01,"News, International",News,GB,en,https://example.org/live.m3u8,,,false
```

The example URL is fictional. Give each row a unique ID and a name. Include a URL scheme such as https:// or rtsp://. Enabled accepts true/false, yes/no or 1/0. Quote fields containing commas and escape an embedded quotation mark by doubling it. Fields must stay on one line.

group is your category; country and language are optional metadata. logo_url and tvg_id are exported into M3U for players that use them. The extension does not fetch programme guides. UTF-8 BOMs and Windows CRLF endings are accepted. Ordinary headers may be reordered, but their names must stay intact.

A failed reload leaves the previous valid list loaded. Edit outside VLC, save, then reload; this extension does not include the Python companion's database editor, M3U importer or HTTP reachability checker. Those tools remain available separately in the repository.

## Manual installation

Copy **iptv-channel-player.lua** and the complete **iptv-channel-player-assets** folder into your user extension directory:

| System | Usual user extension directory |
| --- | --- |
| Windows | `%APPDATA%\vlc\lua\extensions\` |
| Linux | `~/.local/share/vlc/lua/extensions/` or `$XDG_DATA_HOME/vlc/lua/extensions/` |
| macOS | `~/Library/Application Support/org.videolan.vlc/lua/extensions/` |

Create missing folders, retain your existing channels.csv, and restart VLC. The .lua file goes directly in extensions, with the assets folder alongside it. Do not put the entire ZIP folder inside extensions.

## If it does not appear or play

Check the extension path and restart VLC completely. Confirm that your build has Lua extension support; use the standard desktop build if your store or sandboxed build lacks it. VLC's Tools → Plugins and extensions can help inspect discovered extensions. Menu names vary on macOS.

For a channel that fails, try the same URL directly through VLC's Open Network Stream/Open Network command. Providers may require authentication, custom headers or DRM settings that this version does not supply. A CSV row cannot override those requirements. Never post a private stream URL in a public issue.

If an export fails on a Windows path containing non-ASCII characters, try another local folder. Lua's file-renaming behaviour varies by VLC build; an original playlist is backed up before replacement and restored where possible if the final rename fails.

To uninstall, close VLC, delete only iptv-channel-player.lua from your extension directory, then restart VLC. Your CSV and backups remain available. Remove the assets folder yourself only when you no longer need those files.

## Development

```sh
lua5.1 tests/test_extension.lua . /tmp/iptv-test-folder
python3 -m unittest discover -s tests -v
```

Create a fresh temporary test folder first. The suite checks the restricted descriptor scan, CSV handling, filtering, playback and queue calls, failed reloads and export recovery. It uses VLC API doubles, so it is not evidence that a remote channel plays. See [VALIDATION.md](VALIDATION.md) for desktop checks and outstanding limits.

## Usage notice

Do not misuse this software. Use only IPTV channels and streams you are authorised to watch. Do not access or redistribute content unlawfully. You are responsible for applicable laws, provider terms and licensing requirements, including a UK TV Licence where required. Availability and playback are not guaranteed. Keep playlists containing passwords or access tokens private. This independent extension is not affiliated with VideoLAN or any broadcaster.

The code uses the supplied MIT licence. That does not grant rights to streams, channel logos or the supplied TABARC-Code artwork. This is a VLC Lua extension registered through VLC's supported extension mechanism, not a VideoLAN-certified product.
