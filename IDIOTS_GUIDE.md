# IPTV setup: the complete beginner’s guide

This guide takes you from the download to your first channel in desktop VLC. You do not need Python, a compiler or to edit the Lua script. I keep the channel list in a separate CSV so adding a station means changing a spreadsheet row.

You do need a stream you are authorised to watch. The package includes disabled examples, not subscriptions or working television feeds.

## 1. Download and unpack

1. Install desktop VLC 3 from https://www.videolan.org/vlc/.
2. Open this project's [Releases page](https://github.com/TABARC-Code/VLC-IPTV-Plugin-Studio-V2/releases/latest).
3. Under **Assets**, download the file named **iptv-channel-player-native-v1.4.9.zip**.
4. Extract the whole ZIP into Documents or another folder you can find again. On Windows, right-click it and choose **Extract All**. On macOS, double-click it. On Linux, use your archive manager's Extract command.
5. Open the extracted folder containing **START HERE.txt** and the installer files. Keep these files together.

Run the installer from the extracted folder. A ZIP preview looks convincing, but it is a poor place to install anything.

This package targets standard desktop VLC 3. Mobile VLC is unsupported and VLC 4 has not been verified. Store, Flatpak and other sandboxed builds may use different folders or omit Lua extension support. Windows and macOS desktop installation still need verification; see [VALIDATION.md](VALIDATION.md).

## 2. Install for your account

Close VLC completely before installing.

| Your computer | What to do in the extracted folder |
| --- | --- |
| Windows | Double-click **Install Windows.cmd**. It runs the included PowerShell installer for your account. |
| macOS | Double-click **Install macOS.command**. If it cannot run, open Terminal, type `cd ` with a trailing space, drag the extracted folder into Terminal, press Return, then run `sh install-unix.sh`. |
| Linux | Use your file manager's **Open in Terminal** in the extracted folder, then run `sh install-unix.sh`. Alternatively, use the same `cd` and folder-drag method described above. |

Read the installer message: it prints the location of **channels.csv**. Keep that path. A normal user installation needs no administrator account or sudo. Updating preserves an existing channel CSV and backs up the previous extension.

If an installer is blocked, review the files and use the manual instructions in [SETUP.md](SETUP.md) or [README.md](README.md). Do not weaken your computer's security settings just to get past a dialogue.

## 3. Open the extension

Restart VLC. On Windows and Linux, choose **View → IPTV Channel Player V2**. On macOS, look in VLC's **Extensions** menu; the location depends on the build.

The extension opens inside VLC with a CSV path filled in. If it is missing, check the installation path in [SETUP.md](SETUP.md), confirm that your VLC build supports Lua extensions, and restart VLC completely.

## 4. Prepare your first channel

1. Make a backup copy of the installed **channels.csv**.
2. Open the original in Excel, LibreOffice Calc or a plain text editor.
3. Keep the first row exactly as supplied. It contains the column names.
4. On one example row, replace **name** with your channel's name and **stream_url** with the direct stream address from your authorised provider.
5. Set **enabled** to **true** for that row. Leave examples you have not replaced set to **false**.
6. Save as **UTF-8 CSV with commas**, keeping the .csv filename. Close the spreadsheet before reloading.

Use [CSV_GUIDE.md](CSV_GUIDE.md) for the full cell-by-cell layout, worked examples and saving instructions. It also explains how to create your own list from a blank spreadsheet.

A broadcaster's viewing webpage is usually not a playable stream URL. An M3U playlist is a list of channels, not a single channel address. VLC itself can open a playlist through **Media → Open Network Stream** or **Open Network**; this extension loads local CSV files and does not import remote M3U lists.

If you have no URL yet, keep an example.org placeholder and **enabled=false**. Even disabled rows need a URL with a scheme. Turning a placeholder on will not persuade it to become television.

## 5. Load and play

Return to the extension. If you saved your own CSV elsewhere, paste its full local file path into the CSV field. Then choose **Load / Reload CSV**, select one enabled channel and choose **Play selected**.

Use VLC's normal controls for volume, pause, subtitles and full-screen viewing. The extension confirms the hand-off to VLC; playback can still fail at the provider's end. No remote stream playback guarantee is made.

For another channel, add a row with a different ID, save and reload. The extension reads your CSV; it does not edit it for you.

## 6. Keep the list manageable

**Apply filter** updates a name search or group selection. **Show disabled** reveals rows you have kept for later. Disabled rows cannot be played or queued.

**Queue selected** adds selected enabled channels to VLC's current playlist without starting them. **Queue all enabled** adds every enabled row, including rows outside the current filter. Repeated clicks add repeated entries.

**Export M3U** writes all enabled channels to a local .m3u or .m3u8 file for another player. Choose a separate output filename, never your channel database or a filesystem alias of it. Replacing an existing playlist requires a second click and keeps a backup. Exports and backups can contain private tokens; keep them private.

## If something goes wrong

| What you see | What to try |
| --- | --- |
| No enabled channels | Replace a placeholder with an authorised stream, set that row to true, save and reload. |
| Cannot open CSV | Check the full local path, filename extension and file permissions. |
| Missing column or wrong number of columns | Keep all nine headers. Choose comma-separated UTF-8 CSV and quote commas inside names. |
| A channel will not play | Try the same authorised stream directly in VLC's Open Network command. Check your provider's access requirements. Never post private URLs in a public issue. |
| VLC reports authentication or DRM trouble | Ask your provider about supported playback. This extension does not supply custom authentication headers or DRM handling. |

More answers are in [FAQ.md](FAQ.md). The optional [AI prompt](AI_CSV_PROMPT.md), also available through **CSV & AI guide** inside VLC, can format public details you already have. Check its output and add private credentials locally afterwards. The extension does not send your list to an AI service.

## Usage and privacy

Do not misuse this software. Use only streams you are authorised to access. Follow applicable laws, provider terms and licensing requirements, including a UK TV Licence where required. Public playlist links and open-source licences do not grant broadcast rights. Use at your own risk; availability and playback are not guaranteed.

Keep passwords and private stream tokens out of public repositories, screenshots, support requests and AI prompts. Back up your CSV before editing or updating. To uninstall, close VLC and remove only **iptv-channel-player.lua** from your user extension folder; keep your CSV and backups unless you deliberately choose to delete them.
