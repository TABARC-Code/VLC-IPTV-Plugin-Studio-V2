# Known issues and technical debt

- Windows/macOS native GUI and installer validation is outstanding.
- VLC’s extension widgets own the theme and most layout behaviour. Independent themes are not implemented.
- Search uses simple case folding; full Unicode case-insensitive matching needs a later design decision.
- There is a display cap of 1,000 matching records, with a 2 MiB/20,000-record input limit.
- M3U/TXT import, database editing, EPG, favourites, recent history and indexed storage remain roadmap work.
- Lua’s stock rename behaviour can fail on some Windows non-ASCII paths. Export recovery is attempted; backup files may need manual recovery if the filesystem refuses both renames.
- Installers back up the script before updates, but installation of the complete assets set is not transactional.
- Exports assume a single writer. A future locking scheme needs cross-platform behaviour checked before it is added.

Prioritise confirmed defects and measurable friction. A longer feature list is not a performance result.
