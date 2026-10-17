# Free IPTV-list sources and licence references

These links were checked against the upstream repository and its playlist index on 14 October 2026. They are starting points for finding publicly available feeds, not a promise that every channel works or is licensed for every use.

## iptv-org

Repository: https://github.com/iptv-org/iptv

Licence: [The Unlicense, as published in LICENSE](https://github.com/iptv-org/iptv/blob/master/LICENSE). The file grants broad reuse of the repository’s published materials. Its README shows a CC0 badge, which differs from that licence text; this guide follows the actual file. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

The upstream [playlist index](https://github.com/iptv-org/iptv/blob/master/PLAYLISTS.md) lists these URLs:

| Category | Public playlist URL |
| --- | --- |
| General news | https://iptv-org.github.io/iptv/categories/news.m3u |
| Films | https://iptv-org.github.io/iptv/categories/movies.m3u |
| Cartoons/animation | https://iptv-org.github.io/iptv/categories/animation.m3u |
| Children’s channels | https://iptv-org.github.io/iptv/categories/kids.m3u |
| UK TV | https://iptv-org.github.io/iptv/countries/uk.m3u |
| All channels | https://iptv-org.github.io/iptv/index.m3u |

The UK filename is uk.m3u in this index; the CSV country code for the United Kingdom is normally GB. Those are separate conventions.

The maintained index and licence files were read. These links were not playback-tested, and no assurance is made about the rights or continued availability of every destination. The repository states that it stores links rather than video files and handles copyright complaints through its issue process. Its legal section is the maintainer’s statement, not independent clearance from each broadcaster.

## Use with VLC and this extension

For an M3U playlist, VLC itself can open its URL using Media → Open Network Stream (Open Network on some macOS builds). The native extension currently loads local CSV files, not remote M3U playlists.

For a curated CSV, choose the individual channel records you want from a public list, verify their provenance and your permission, then format those records using [CSV_GUIDE.md](CSV_GUIDE.md). Keep unverified or placeholder records disabled. The earlier Python companion has an M3U-to-CSV importer if you need it: https://github.com/TABARC-Code/VLC-IPTV-Plugin.

## Use at your own risk

Do not misuse this software. Use only streams you are authorised to access. You are responsible for applicable laws, provider terms and licensing requirements, including a UK TV Licence where required. A free playlist, an open-source licence or a publicly reachable URL does not grant rights to the video itself. Availability and playback are not guaranteed. Do not access or redistribute content unlawfully; keep private tokens out of public lists, repositories and support requests.

Another candidate, Free-TV/IPTV, was inspected but no root licence file was found in the directory listing. It is therefore not presented here as a verified freely licensed source.
