# Changelog

Actual changes only. Release dates and notes are recorded when the work is published.

## 1.4.8 — 14 October 2026

Protected the loaded channel database from export paths containing alternate separators or dot segments. VLC resolves relative paths before comparison when its URI helper is available; Windows-style comparison also ignores drive/path casing.

A regression reproduced the overwrite on 1.4.7 and checks that two export clicks leave the source intact. Added path-comparison checks for relative/absolute forms, parent segments and Windows-style paths. These tests do not claim Windows desktop validation or complete filesystem alias resolution.

## 1.4.7 — 14 October 2026

Initial release in the separate VLC-IPTV-Plugin-Studio-V2 repository. The earlier Python companion remains in its original repository; its version history is not replayed here.

- Added a native VLC 3 Lua extension with a branded descriptor and in-player controls.
- Added validated CSV loading, group/search filters, selected playback and queueing.
- Added M3U export with replacement confirmation, backup and recovery handling.
- Added Windows, macOS and Linux user-local installers that preserve an existing channel CSV.
- Added beginner documentation, worked CSV files and a copyable AI formatting prompt, also accessible inside VLC.
- Checked Lua 5.1 compatibility, installer upgrades and discovery/activation in Linux VLC 3.0.23. Windows/macOS desktop verification remains outstanding.

The extension’s menu label was adjusted after testing VLC’s use of shortdesc. The empty help browser was also removed from the default layout. Neither needed a framework; both needed a look at the actual window.
