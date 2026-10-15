# Make your own IPTV CSV: a complete beginner’s guide

You can create the list yourself. The file is a small table: one channel per row, with nine required columns and an optional audience column. VLC reads it through IPTV Channel Player V2. A spreadsheet is convenient, but a plain text editor works too.

## Before you start

Install and open the extension using [the complete beginner’s guide](IDIOTS_GUIDE.md). The installer prints the location of channels.csv; that is the file to edit for the quickest route. If you prefer your own file, start with a copy of [examples/starter-categories.csv](examples/starter-categories.csv) from the extracted release folder.

Get a direct stream address from your authorised provider. A website address or the URL of a whole M3U playlist is not a substitute for an individual channel stream. This extension loads local CSV files; VLC itself can open M3U playlists separately.

## The quickest route

1. Copy examples/starter-categories.csv and rename your copy my-channels.csv.
2. Open the copy in Excel or LibreOffice Calc.
3. Keep the first row exactly as it is.
4. Replace a channel name and its stream_url with details from your authorised provider.
5. Set enabled to true for that channel. Leave the other examples false.
6. Save as UTF-8 CSV, close the spreadsheet, paste the file’s full path into the extension and choose Load / Reload CSV.
7. Select the channel and choose Play selected.

The supplied example.org URLs are placeholders. They will not become television channels just because you change false to true.

## Start from a completely blank spreadsheet

Create a new spreadsheet. Type these names in the first row, one name per cell:

| Cell | Type this |
| --- | --- |
| A1 | id |
| B1 | name |
| C1 | group |
| D1 | country |
| E1 | language |
| F1 | stream_url |
| G1 | logo_url |
| H1 | tvg_id |
| I1 | enabled |

On row 2, enter your first channel. A safe practice row is below. Its URL is fictional and it stays disabled.

| Cell | Example value | What it means |
| --- | --- | --- |
| A2 | news-01 | A unique record ID; give the next row another ID |
| B2 | My News | The channel name shown in VLC |
| C2 | News | Your category or group |
| D2 | GB | Country code; optional |
| E2 | en | Language code; optional |
| F2 | https://example.org/news.m3u8 | Replace with your authorised playable stream URL |
| G2 | leave blank | Optional logo URL |
| H2 | leave blank | Optional programme-guide channel ID |
| I2 | false | true includes it; false keeps it disabled |

Add more channels on rows 3, 4 and onwards. Do not put notes above the header or add another heading in the middle of the data.

If you do not have a stream URL, enter https://example.org/placeholder.m3u8 and set enabled to false. Leave it disabled until you have replaced the placeholder and checked your permission. A blank stream_url is rejected even on a disabled row.

All nine column names are required. Country, language, group, logo and programme-guide cells can be empty. ID, name, stream URL and enabled need values. Headers may be reordered, but keeping the standard order makes support and copying examples easier.

## Audience categories and XXX

For the simplest setup, use one of these complete names in `group`: Cartoons, Animation, 12+, 16+, 18+, XXX, Adult or Adult (XXX). Capitalisation and surrounding spaces do not matter. Adult, Adult (XXX) and XXX all select the XXX category. Unknown groups remain Unrated; channel names are not inspected.

If you want to keep groups such as Films or UK TV, add **audience** as a tenth header in J1. Put one of the following values into each row:

| Value | Audience dropdown |
| --- | --- |
| cartoons | Cartoons |
| 12+ | 12+ only |
| 16+ | 16+ only |
| 18+ | 18+ only, separate from XXX |
| xxx | XXX, hidden until Show XXX is ticked |
| unrated | Unrated, overriding the group fallback |
| blank cell | Use the recognised group name, otherwise Unrated |

These are your labels, not official or automatically verified ratings. Cartoons may include adult animation: give those rows an appropriate 18+ or XXX audience and retain Cartoons as the group if useful. An explicit audience overrides the group. Invalid audience values reject the reload and preserve the previous valid list.

```csv
id,name,group,country,language,stream_url,logo_url,tvg_id,enabled,audience
animation-01,My Animation,Cartoons,GB,en,https://example.org/placeholder.m3u8,,,false,16+
adult-01,My Adult Channel,Films,GB,en,https://example.org/placeholder.m3u8,,,false,xxx
```

All ten cells must be present on each row when this header is used. Older nine-column files need no conversion. There is a complete disabled template at [examples/audience-categories.csv](examples/audience-categories.csv).

In VLC, choose **Audience**, set **Show XXX** if wanted and press **Apply filter**. Show all respects the XXX checkbox. To include every enabled channel in a queue or export, select Show all, tick Show XXX, select All groups and clear Search. Queue filtered and Export M3U respect those controls even before Apply filter; disabled rows remain excluded. They also include matching rows beyond the display cap. Opening the extension resets XXX to hidden. It does not remove existing playlist items or stop playback.

## Save it properly

In Excel, choose File → Save As, then **CSV UTF-8 (Comma delimited)**. In LibreOffice, choose **Text CSV**, UTF-8 encoding and a comma separator. If asked, keep the CSV format.

Choose a folder you can find again, such as Documents, and save as my-channels.csv. Renaming an Excel workbook from .xlsx to .csv does not convert it. The extension needs the actual text CSV format.

On Windows, File Explorer’s Copy as path is handy. On macOS, hold Option while opening the file’s context menu to look for a pathname copy option. On Linux, your file manager may provide Copy location. You can always type the full path.

## Or type the CSV in a text editor

Copy these two lines into a plain text file:

```csv
id,name,group,country,language,stream_url,logo_url,tvg_id,enabled
news-01,My News,News,GB,en,https://example.org/news.m3u8,,,false
```

Save with UTF-8 encoding and a .csv extension. In Windows Notepad’s Save As dialogue, choose All files if needed, so it does not append .txt. Keep this example disabled until you replace the URL.

Each comma marks a new column. The three commas after the URL leave logo_url and tvg_id empty before enabled. If your channel name contains a comma, quote the whole field:

```csv
world-01,"News, International",News,GB,en,https://example.org/world.m3u8,,,false
```

A quotation mark inside a quoted field is doubled:

```csv
kids-01,"The ""Cartoon"" Channel",Cartoons,GB,en,https://example.org/kids.m3u8,,,false
```

Keep each record on one line. The parser accepts a UTF-8 BOM and Windows line endings, but not multiline cells.

## Add another channel and keep your changes

Copy a complete row, give the copy a new ID, then change its name, group and stream URL. Save the CSV and choose **Load / Reload CSV** in VLC. If the new row is disabled, tick **Show disabled** and choose **Apply filter** to see it.

Keep a backup before a large edit. Do not save an M3U export over your CSV or an alias of it: exports are separate playlists, and your source table is the file you will want next week.

## Groups, country, language and guides

Use whatever group names help you: News, Films, Cartoons, UK TV, Local, or something of your own. Blank groups appear as Ungrouped. Search also uses country and language metadata.

Use recognised country codes when you know them: GB for the United Kingdom, IE for Ireland, US for the United States, FR for France, DE for Germany. Language examples are en, fr and de. A country value does not bypass a region restriction; it is just information about the record.

logo_url should be a direct image URL if your player supports it. tvg_id should match the exact channel identifier in the external XMLTV guide you use. This release exports that identifier to M3U but does not fetch or display the guide. Do not guess identifiers and expect a schedule to arrive by magic.

## Fix the usual errors

| Message | What to check |
| --- | --- |
| Missing CSV column | Keep all header names and use commas as the separator |
| Duplicate ID | Every channel record needs a different id |
| Wrong number of columns | Quote commas inside names and retain empty cells |
| Unclosed quote | Close the quoted field; remove line breaks inside cells |
| Stream URL needs a scheme | Include https://, rtsp:// or the scheme your provider gives you |
| Cannot open CSV | Use the full local path and check file permissions |
| No enabled channels | Change authorised rows to true, save and reload |

If loading fails, the previous valid list remains loaded. Save spreadsheet changes before reloading. The extension reads the file; it does not write changes back into your database.

## Want AI to format the list?

Use [AI_CSV_PROMPT.md](AI_CSV_PROMPT.md). It gives you a prompt to copy, including instructions for missing URLs, commas and enabled flags. The same short prompt is available inside VLC through CSV & AI guide. Treat the AI result as a draft and check it before importing.

## Usage and privacy

Do not misuse this software. Use streams you are authorised to watch and follow applicable laws, provider terms and licensing requirements. A list being free to download does not establish those rights. Playback and availability are not guaranteed.

Private URLs can contain passwords or access tokens. Keep them out of public GitHub commits and AI prompts. Add sensitive parts locally after the AI has formatted the public metadata. Keep a backup of your own CSV; it is the bit you would miss.
