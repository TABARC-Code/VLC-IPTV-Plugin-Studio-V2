# Known issues and technical debt

- Windows/macOS native GUI and installer validation is outstanding.
- VLC’s extension widgets own the theme and most layout behaviour. Independent themes are not implemented.
- Search uses simple case folding; full Unicode case-insensitive matching needs a later design decision.
- There is a display cap of 1,000 matching records, with a 2 MiB/20,000-record input limit.
- The optional Studio imports local M3U/M3U8 channel lists and edits CSV libraries. TXT import, native-extension importing, EPG, favourites, recent history and indexed storage remain roadmap work.
- Studio’s 3.4.1 unsaved-work prompts and private temporary-playlist lifecycle have automated boundary tests but still need graphical Electron and real VLC process validation.
- Lua’s stock rename behaviour can fail on some Windows non-ASCII paths. Export recovery is attempted; backup files may need manual recovery if the filesystem refuses both renames.
- Installers back up the script before updates, but installation of the complete assets set is not transactional.
- Exports assume a single writer. A future locking scheme needs cross-platform behaviour checked before it is added.
- Source-path comparison normalises common spelling aliases, but does not resolve all symbolic-link or mount aliases. Choose a separate output filename from your channel database.

Prioritise confirmed defects and measurable friction. A longer feature list is not a performance result.
