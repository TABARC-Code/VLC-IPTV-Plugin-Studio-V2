# The “I have never done this before” guide

Start with the release ZIP, not a screenshot of the code. You need desktop VLC 3 installed. The extension does not include television subscriptions or working channel feeds.

1. Download and extract the whole ZIP into Documents or another folder you can find again.
2. Close VLC. On Windows, double-click Install Windows.cmd. On macOS, use Install macOS.command; if it cannot run, open Terminal in the extracted folder and type sh install-unix.sh. On Linux, use the same Terminal command.
3. Read the installer’s message. It tells you where the example channels.csv is stored.
4. Open VLC again. On Windows/Linux, choose View → IPTV Channel Player V2. On macOS, look in Extensions for that entry.
5. Open the installed CSV in Excel or LibreOffice. Keep its first row. Replace a sample name and stream URL with details from your authorised provider. Set enabled to true for that row.
6. Save as UTF-8 CSV. Return to the extension and choose Load / Reload CSV.
7. Select one channel in the list. Choose Play selected.

VLC’s normal controls handle volume, pause and full-screen viewing. The extension confirms that it handed a channel to VLC, which may still report a provider or playback error. That distinction matters.

Want a list from scratch? Follow [CSV_GUIDE.md](CSV_GUIDE.md), starting with its cell-by-cell table. Want AI to format records you already have? Copy [AI_CSV_PROMPT.md](AI_CSV_PROMPT.md), or open CSV & AI guide inside VLC. Check the result before using it.

To add another channel, add a spreadsheet row with another unique ID. To keep a channel without playing or exporting it, leave enabled=false. Save and reload after changes. No editing of the Lua script is needed.

If the extension is missing, check [SETUP.md](SETUP.md). If a stream fails, test that same authorised URL directly in VLC’s Open Network Stream/Open Network command. A normal viewing webpage is not normally a playable stream address.

Do not misuse the extension. You are responsible for permission to access your streams and the relevant laws, provider terms and licensing requirements. Keep private access tokens out of public issues, repositories and AI prompts.
