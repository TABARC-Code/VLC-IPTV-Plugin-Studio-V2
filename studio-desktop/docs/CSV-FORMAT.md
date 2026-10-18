# CSV file layout

Studio reads UTF-8 comma-separated files. The recommended header is:

```csv
id,name,group,country,language,stream_url,logo_url,tvg_id,enabled,audience,adult,notes
```

Only `name` and `stream_url` are compulsory on import. Missing optional fields are added when Studio saves the library.

| Column | Purpose | Example |
|---|---|---|
| `id` | Unique stable row ID. Generated if blank. | `bbc-news-demo` |
| `name` | Display name. | `News Channel` |
| `group` | User-controlled channel group; shown as Category in Studio. | `News` |
| `country` | Code or readable country name. | `GB` |
| `language` | Display language. | `English` |
| `stream_url` | Complete authorised stream URL. | `https://provider.example/live.m3u8` |
| `logo_url` | Optional HTTPS image URL. | `https://provider.example/logo.png` |
| `tvg_id` | Optional guide/channel identifier. | `news.example` |
| `enabled` | Include in playback/export: `true` or `false`. | `true` |
| `audience` | Optional exact category: cartoons, 12+, 16+, 18+, xxx or unrated. | `18+` |
| `adult` | Legacy compatibility flag; Studio derives it from audience. | `true` |
| `notes` | Private organisational note. | `Evening schedule` |

## Compatibility aliases

The headings `group` and `group-title` become `category`. `url` becomes `stream_url`. `mature` and `18+` become `adult`.

## Full example

```csv
id,name,group,country,language,stream_url,logo_url,tvg_id,enabled,audience,adult,notes
demo-one,Example News,"News, International",GB,English,https://provider.example/news.m3u8,https://provider.example/news.png,example.news,false,,false,Replace the placeholder
demo-two,Example Late,Entertainment,US,English,https://provider.example/late.m3u8,,example.late,false,18+,true,Hidden until 18+ is shown
```

The addresses above are placeholders and are disabled. Replace them with authorised provider URLs.

## Rules worth knowing

- Keep one channel per row.
- Quote any field containing a comma, quotation mark or line break.
- Duplicate IDs are rejected.
- Accepted stream schemes are HTTP, HTTPS, RTSP, RTMP and UDP.
- Files larger than 20 MB are rejected. Split unusually large catalogues into libraries.
- Studio exports enabled rows only. Search and filters determine which part of the library is handed to VLC.


The Studio export is directly readable by the VLC 3 Lua extension. Studio accepts legacy `category` and `adult` headings on import. Adult and XXX classification is preserved explicitly in the `audience` column; an older `adult=true` becomes `18+`, never `XXX` by inference. Keep notes on one physical line for native VLC compatibility.
