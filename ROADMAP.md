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

## Next: verify and remove friction

Validate the installers and in-player interface on Windows and macOS. Check keyboard navigation, screen readers, high DPI, long paths and non-ASCII filenames. Confirm provider-format behaviour with authorised sample streams. Review the 1,000-item display cap and the 2 MiB input limit using measured timings before raising either. Add useful failures rather than optimistic status labels.

## Playlist organisation

Plan favourites, recently viewed, multiple lists, custom collections, sorting, bulk operations, tags, colour labels and saved searches. Studio’s duplicate report is implemented; any future merge or deletion must remain an explicit user decision. Basic native country/language selectors arrive in 3.5.0, while richer views and saved preferences remain future work.

## Import and guides

Studio has local M3U/M3U8 import and operating-system file choosers. Plan TXT import, drag and drop, watched folders and controlled automatic reload. Add XMLTV EPG ingestion, mapping and guide views, with clear cache and expiry rules. These are not present in the native VLC extension.

## A larger studio

Lua is the right adapter for VLC’s supported extension mechanism. An indexed database, lazy loading and a custom accessible desktop UI may justify a separate Rust core and companion. Assess that architecture before implementing it; don’t smuggle a server, database and package manager into an extension to make the feature list look longer.

VLC currently owns this extension’s theme and widget styling. The brief’s independent dark/light themes, responsive layouts and broader accessibility goals need design and testing in the appropriate host or companion. They are not guarantees made by this release.

## How changes are accepted

Use a bounded Kaizen pass: identify one real problem, change the smallest useful part, measure or test it, then document what improved and what remains uncertain. Subsequent releases follow semantic versioning. Publish at actual times; irregular release cadence is fine, invented history is not.
