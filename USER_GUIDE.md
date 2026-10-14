# User guide

The extension reads a local CSV. Loading validates every record first, then replaces the visible list. A failed load retains the previous list. Save changes in your spreadsheet and reload here.

Search covers name, group, country and language. Choose a group or change the search and press Apply filter. Show disabled displays retained records, but they cannot be selected for playback. Search uses simple case folding and literal matching rather than patterns.

Play selected needs exactly one enabled channel. Queue selected accepts multiple enabled selections. Queue all enabled ignores the current filter and adds every enabled record. Queue buttons append to VLC’s existing playlist without starting it or clearing it. Repeated queue clicks add another copy.

Export M3U also ignores the filter. Choose a new filename, or click a second time to confirm replacement of an existing export. A .backup file is retained. Both exports and backups may contain private stream credentials; handle them accordingly.

The extension remembers the CSV’s local filename separately in the VLC configuration directory. It does not rewrite the database. TVG identifiers and logos are retained in the M3U export, but there is no EPG download or guide display in this version.

See [CSV_GUIDE.md](CSV_GUIDE.md) for file layout and [FAQ.md](FAQ.md) for limits and troubleshooting. Help & usage and CSV & AI guide inside VLC provide the short instructions without leaving the player.
