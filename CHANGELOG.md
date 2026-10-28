# Changelog

## 3.4.1 — 28 October 2026

- High: Studio VLC launches now use private, application-owned temporary playlists. Files are removed when VLC exits, when Studio closes, and on the next clean start after an interrupted session; launch failures are reported instead of becoming uncaught process errors.
- Medium: Every Studio IPC call must originate from the exact local renderer URL. Navigation and new-window blocking remain in place as a second boundary.
- Medium: CSV import, saving, M3U export and VLC launch share a 20,000-channel ceiling, with a per-field limit to stop oversized renderer payloads bypassing file-import limits.
- Medium: Studio warns before library changes, imports or window closure discard unsaved edits. Adult badges now distinguish 18+ from XXX.
- Native extension stream URLs now use the same HTTP, HTTPS, RTSP, RTMP and UDP allowlist as Studio.
- The release gate now exercises the optional Home Assistant bridge and Lovelace tests as well as the native extension, installers and Studio.

Both applications identify as 3.4.1. Automated checks do not establish successful playback, desktop rendering or installer behaviour on end-user hardware; see VALIDATION.md.

## 3.1.0 — 18 October 2026

Four separately recorded development changes:

- High: Studio saves VLC-compatible channel CSV files, retaining 18+ and XXX audience labels and rejecting duplicate equivalent headings.
- Medium: Studio imports local M3U playlists as disabled channel records for review; it rejects HLS segment manifests.
- Medium: Studio reports repeated stream URLs and programme-guide identifiers without deleting records.
- Medium: Studio regression and syntax checks run in the root release gate, alongside independent cross-platform runner checks.

Both applications now identify as 3.1.0. Home Assistant and Lovelace remain optional. Real VLC playback still needs platform testing.

## 1.5.2 — 17 October 2026

- Consolidated the Home Assistant camera bridge and theme-aware Lovelace interface.
- Retired obsolete reference documents and maintenance records from the current package.
- Simplified the in-player CSV help and adjusted installers to package the retained guides.
- Playback and channel parsing remain unchanged.

Actual changes only. Release dates and notes are recorded when the work is published.

## 1.5.1 — 15 October 2026

- Added an executable Linux launcher alongside the macOS launcher. Both pass installer options through and work from other working directories; the Mac launcher waits for Return only in an interactive terminal.
- Added installer dry-run and an explicit VLC data-directory option, with absolute-path checks and package completeness checks before copying.
- Added macOS and Linux installer CI jobs covering native default paths, Unicode/spaces in paths, upgrades and launchers. Release publication now waits for both platforms and the Lua checks.
- Clarified that one Lua plugin serves all three desktop systems, with no Python runtime or compilation required. Desktop GUI/playback testing remains separate from installer checks.

## 1.5.0 — 15 October 2026

- Added a single-choice Audience dropdown: Show all, Cartoons, 12+, 16+, 18+, XXX and Unrated.
- Added Show XXX, off on every opening. Show all respects that setting.
- Added optional audience CSV metadata and exact group-name fallbacks; existing nine-column CSV files remain supported.
- Queue filtered replaces Queue all enabled. Bulk queue and M3U export now honour search, group, audience and XXX visibility, including matches beyond the display cap. Selected actions recheck changed controls before handing channels to VLC.
- Added disabled audience examples and regression coverage. Labels are user-assigned categories, not verified age ratings or a parental lock.

## 1.4.10 — 15 October 2026

Added source-research documentation covering citations, licence checks, indexed links and endpoint verification. The reference guide was retired from subsequent packages.

## 1.4.9 — 15 October 2026

Expanded the packaged beginner guide into a download-to-play walkthrough, with Windows, macOS and Linux installation steps, first-channel setup, CSV saving, queue/export behaviour and troubleshooting. Clarified missing URLs and disabled placeholders in the CSV guide, and added direct pointers in START HERE.txt.

Runtime behaviour is unchanged. Existing installers already copy both Markdown guides beside the installed CSV while preserving user data. Platform and playback limitations remain.

## 1.4.8 — 14 October 2026

Protected the loaded channel database from export paths containing alternate separators or dot segments. VLC resolves relative paths before comparison when its URI helper is available; Windows-style comparison also ignores drive/path casing.

A regression reproduced the overwrite on 1.4.7 and checks that two export clicks leave the source intact. Added path-comparison checks for relative/absolute forms, parent segments and Windows-style paths. These tests do not claim Windows desktop validation or complete filesystem alias resolution.

## 1.4.7 — 14 October 2026

Initial release in the separate VLC-IPTV-Plugin-Studio-V2 repository. The earlier Python companion remains in its original repository; its version history is not replayed here.

- Added a native VLC 3 Lua extension with a branded descriptor and in-player controls.
- Added validated CSV loading, group/search filters, selected playback and queueing.
- Added M3U export with replacement confirmation, backup and recovery handling.
- Added Windows, macOS and Linux user-local installers that preserve an existing channel CSV.
- Added beginner documentation, worked CSV files and an in-player CSV guide.
- Checked Lua 5.1 compatibility, installer upgrades and discovery/activation in Linux VLC 3.0.23. Windows/macOS desktop verification remains outstanding.

The extension’s menu label was adjusted after testing VLC’s use of shortdesc. The empty help browser was also removed from the default layout. Neither needed a framework; both needed a look at the actual window.
