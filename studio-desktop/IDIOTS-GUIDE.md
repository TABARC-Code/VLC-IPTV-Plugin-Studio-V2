# The “I just want the channels to open” guide

Let’s do this without jargon aerobics.

## You need two things

1. **VLC**, installed from [videolan.org](https://www.videolan.org/vlc/).
2. **A CSV file containing streams you are allowed to watch.** The app does not provide channels.

If you downloaded a finished Studio release, open the application normally. If you downloaded the source code, install Node.js 20+, open a terminal in the folder, run `npm install`, then `npm start`.

## First opening

Studio shows a usage notice. Read it and choose **I understand**. It appears once unless the app’s local data is cleared.

The empty table is not a fault. It is merely empty, which computers express with all the warmth of an unfurnished council office.

## Import your CSV

Choose **Import CSV** and select the file. Studio checks the structure before copying it into its managed library folder.

The shortest useful file is:

```csv
name,stream_url
My authorised channel,https://provider.example/live.m3u8
```

The full recommended heading is:

```csv
id,name,category,country,language,stream_url,logo_url,tvg_id,enabled,adult,notes
```

- `enabled` decides whether a channel is included when you play or export.
- `adult` decides whether the channel is hidden until **Show 18+ channels** is switched on.
- Use `true` or `false` for both.
- Put quotation marks around a value containing a comma: `"News, International"`.

See [docs/CSV-FORMAT.md](docs/CSV-FORMAT.md) for every field.

## Add or tidy channels

- **Add channel** creates one row.
- The pencil button edits a row.
- The bin removes it from the working list. Choose **Save** to make that permanent.
- Category and country filters sit on the left.
- The search box matches channel name, category, country and language.
- Press `/` to jump to search.

## Play the list

Choose **Play visible in VLC**. Studio sends VLC the enabled rows currently visible after search and filters.

If VLC is not found, locate its executable:

- Windows: usually `C:\Program Files\VideoLAN\VLC\vlc.exe`
- macOS: `/Applications/VLC.app/Contents/MacOS/VLC`
- Linux: commonly `/usr/bin/vlc`

Video opens in VLC. Studio remains the organiser; VLC remains the player.

## Put files in the watched folder

Choose **Open library folder**. Copy UTF-8 `.csv` files there, return to Studio and press the circular refresh button beside **Libraries**. Select the file from the list.

Studio does not silently ingest every file it sees. Silent automation is charming until it mistakes the wrong spreadsheet for your television.

## If nothing plays

1. Confirm the row is enabled.
2. Confirm it is visible under the active filters.
3. Copy the stream URL into VLC’s **Open Network Stream** box.
4. Ask the provider whether the URL needs headers, credentials, DRM or its own supported app.

Studio does not bypass DRM or access controls. A normal webpage URL is usually not a stream URL.

## Keep a backup

Your CSV is the valuable part. Copy it somewhere safe before a large edit. The app writes saves atomically, but that does not protect against enthusiastic deletion, disk failure or tea applied directly to the laptop.

