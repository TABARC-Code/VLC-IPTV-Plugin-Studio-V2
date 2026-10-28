# User guide

The extension reads a local CSV. Loading validates every record first, then replaces the visible list. A failed load retains the previous list. Save changes in your spreadsheet and reload here.

Search covers name, group, country and language. Choose a group, country or language—or change the search—and press Apply filter. Country and language choices come from non-empty values in the loaded CSV. Show disabled displays retained records, but they cannot be selected for playback. Search uses simple case folding and literal matching rather than patterns.

Play selected needs exactly one enabled channel. Queue selected accepts multiple enabled selections. Queue filtered adds enabled records matching the current search, group, country, language and audience settings. Queue buttons append to VLC’s existing playlist without starting it or clearing it. Repeated queue clicks add another copy.

Export M3U uses the current search, group, country, language and audience settings and excludes disabled rows. Queue filtered and export include matches beyond the 1,000-row display cap. Choose a new filename, or click a second time to confirm replacement of an existing export. A .backup file is retained. Both exports and backups may contain private stream credentials; handle them accordingly.

Choose an Audience category and press Apply filter. Show all still hides XXX until Show XXX is ticked. Each age label is an exact category, not an upper age limit. Unrated contains unlabelled records without a recognised group. The controls reset to Show all with XXX hidden whenever you reopen the extension. Changing a filter does not stop playback or remove previously queued items. This is not a parental lock.

Set labels in the optional audience CSV column, or use recognised group names; see the [audience setup instructions](CSV_GUIDE.md#audience-categories-and-xxx). Cartoons is a category, not a promise of child suitability. Playback, queueing and export check the current controls even if Apply filter has not yet refreshed the display.

The extension remembers the CSV’s local filename separately in the VLC configuration directory. It does not rewrite the database. TVG identifiers and logos are retained in the M3U export, but there is no EPG download or guide display in this version.

See [CSV_GUIDE.md](CSV_GUIDE.md) for file layout and [FAQ.md](FAQ.md) for limits and troubleshooting. Help & usage and CSV guide inside VLC provide the short instructions without leaving the player.
