# Roadmap

The development brief is the direction of travel. This page distinguishes implemented behaviour from work still needed.

## Implemented in 1.4.7

Native VLC dialog, CSV validation, group and text filters, enabled records, selected playback, queueing, M3U export, backup handling, user-local installation, branding and beginner CSV instructions. The reader does not modify the original channel database.

## Added in 1.5.0

Audience dropdown, XXX visibility checkbox, optional audience CSV metadata and legacy group fallbacks. Playback, queue and export respect current filters. Labels are user-assigned; no age verification or parental lock is provided.

## Added in 3.1.0 and 3.4.1

The optional Studio now imports local M3U/M3U8 channel lists as disabled review candidates, edits VLC-compatible CSV libraries and reports possible duplicate URLs or guide IDs without deleting records. Version 3.4.1 adds private temporary-playlist cleanup, bounded edit payloads, renderer-origin checks and unsaved-work protection. These companion features do not enlarge VLC’s native Lua interface.

## Added in 3.5.0

The native VLC extension now builds country and language selectors from CSV metadata. These exact filters combine with search, group and audience controls and govern the displayed list, queueing and export.

## Added in 3.6.0

The optional desktop Studio now accepts local XMLTV and gzip-compressed guide files. It matches programme data against stored TVG IDs, caches schedule text independently of channel libraries, and shows current or upcoming listings. Native VLC still has no embedded EPG. Automatic downloading, remote refresh and manual ID mapping remain future work.

## Added in 3.7.0

Studio now supports explicit per-library XMLTV channel links, including overrides for otherwise unmatched TVG IDs. The link lives outside the CSV and can be removed independently. The same guide entry can now appear under separate channel variants where intentionally linked.

## Added in 3.8.0

Studio now remembers a selected local XMLTV source and refreshes only when requested. It checks the file fingerprint, retains the existing guide when reading or parsing fails, and rejects unexpectedly large reductions in programme count. Forget source removes the remembered local file location without discarding programme listings or channel links.

## Next: verify and remove friction

Validate the installers and in-player interface on Windows and macOS. Check keyboard navigation, screen readers, high DPI, long paths and non-ASCII filenames. Confirm provider-format behaviour with authorised sample streams. Review the 1,000-item display cap and the 2 MiB input limit using measured timings before raising either. Add useful failures rather than optimistic status labels.

## Playlist organisation

Plan favourites, recently viewed, multiple lists, custom collections, sorting, bulk operations, tags, colour labels and saved searches. Studio’s duplicate report is implemented; any future merge or deletion must remain an explicit user decision. Basic native country/language selectors arrive in 3.5.0, while richer views and saved preferences remain future work.

## Import and guides

Studio has local M3U/M3U8 import and operating-system file choosers. Plan TXT import, drag and drop, watched folders and controlled automatic reload. Studio now has local XMLTV EPG ingestion, exact TVG ID matching, a searchable guide and a clearable offline cache with expiry status. Remote network fetching, scheduled refresh, bulk mapping suggestions and broader XMLTV dialect support remain future work; manual ID linking is available in Studio. The native VLC extension still has no EPG panel.

## A larger studio

Lua is the right adapter for VLC’s supported extension mechanism. An indexed database, lazy loading and a custom accessible desktop UI may justify a separate Rust core and companion. Assess that architecture before implementing it; don’t smuggle a server, database and package manager into an extension to make the feature list look longer.

VLC currently owns this extension’s theme and widget styling. The brief’s independent dark/light themes, responsive layouts and broader accessibility goals need design and testing in the appropriate host or companion. They are not guarantees made by this release.

## How changes are accepted

Use a bounded Kaizen pass: identify one real problem, change the smallest useful part, measure or test it, then document what improved and what remains uncertain. Subsequent releases follow semantic versioning. Publish at actual times; irregular release cadence is fine, invented history is not.
