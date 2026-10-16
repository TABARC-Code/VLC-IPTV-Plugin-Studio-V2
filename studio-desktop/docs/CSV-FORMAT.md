# CSV file layout

Studio reads UTF-8 comma-separated files. The recommended header is:

```csv
id,name,category,country,language,stream_url,logo_url,tvg_id,enabled,adult,notes
```

Only `name` and `stream_url` are compulsory on import. Missing optional fields are added when Studio saves the library.

| Column | Purpose | Example |
|---|---|---|
| `id` | Unique stable row ID. Generated if blank. | `bbc-news-demo` |
| `name` | Display name. | `News Channel` |
| `category` | User-controlled group. | `News` |
| `country` | Code or readable country name. | `GB` |
| `language` | Display language. | `English` |
| `stream_url` | Complete authorised stream URL. | `https://provider.example/live.m3u8` |
| `logo_url` | Optional HTTPS image URL. | `https://provider.example/logo.png` |
| `tvg_id` | Optional guide/channel identifier. | `news.example` |
| `enabled` | Include in playback/export: `true` or `false`. | `true` |
| `adult` | Hide unless the 18+ switch is enabled. | `false` |
| `notes` | Private organisational note. | `Evening schedule` |

## Compatibility aliases

The headings `group` and `group-title` become `category`. `url` becomes `stream_url`. `mature` and `18+` become `adult`.

## Full example

```csv
id,name,category,country,language,stream_url,logo_url,tvg_id,enabled,adult,notes
demo-one,Example News,"News, International",GB,English,https://provider.example/news.m3u8,https://provider.example/news.png,example.news,false,false,Replace the placeholder
demo-two,Example Late,Entertainment,US,English,https://provider.example/late.m3u8,,example.late,false,true,Hidden until 18+ is shown
```

The addresses above are placeholders and are disabled. Replace them with authorised provider URLs.

## Rules worth knowing

- Keep one channel per row.
- Quote any field containing a comma, quotation mark or line break.
- Duplicate IDs are rejected.
- Accepted stream schemes are HTTP, HTTPS, RTSP, RTMP and UDP.
- Files larger than 20 MB are rejected. Split unusually large catalogues into libraries.
- Studio exports enabled rows only. Search and filters determine which part of the library is handed to VLC.

