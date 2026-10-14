# Roadmap

The development brief is the direction of travel. This page distinguishes implemented behaviour from work still needed.

## Implemented in 1.4.7

Native VLC dialog, CSV validation, group and text filters, enabled records, selected playback, queueing, M3U export, backup handling, user-local installation, branding and beginner/AI CSV instructions. The reader does not modify the original channel database.

## Next: verify and remove friction

Validate the installers and in-player interface on Windows and macOS. Check keyboard navigation, screen readers, high DPI, long paths and non-ASCII filenames. Confirm provider-format behaviour with authorised sample streams. Review the 1,000-item display cap and the 2 MiB input limit using measured timings before raising either. Add useful failures rather than optimistic status labels.

## Playlist organisation

Plan favourites, recently viewed, multiple lists, custom collections, country/language views, sorting, duplicate review, bulk operations, tags, colour labels and saved searches. Preserve source records when merging; deletion or deduplication should remain an explicit user decision. User-controlled mature-content labels can be considered when metadata supports them.

## Import and guides

Plan M3U/M3U8/TXT import, a file chooser where the host supports it, drag and drop, watched folders and controlled automatic reload. Add XMLTV EPG ingestion, mapping and guide views, with clear cache and expiry rules. These are not present in the native 1.4.7 extension.

## A larger studio

Lua is the right adapter for VLC’s supported extension mechanism. An indexed database, lazy loading and a custom accessible desktop UI may justify a separate Rust core and companion. Assess that architecture before implementing it; don’t smuggle a server, database and package manager into an extension to make the feature list look longer.

VLC currently owns this extension’s theme and widget styling. The brief’s independent dark/light themes, responsive layouts and broader accessibility goals need design and testing in the appropriate host or companion. They are not guarantees made by this release.

## How changes are accepted

Use a bounded Kaizen pass: identify one real problem, change the smallest useful part, measure or test it, then document what improved and what remains uncertain. Subsequent releases follow semantic versioning. Publish at actual times; irregular release cadence is fine, invented history is not.
