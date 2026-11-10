# Local XMLTV programme guide

I added this guide to Studio so I can see programme listings beside the channel library without relying on an online service. VLC still handles playback, and programme-guide imports never edit the CSV.

## Import a schedule

Open Studio, expand **Programme guide** beneath the channel table and choose **Import XMLTV**. Select a local `.xml`, `.xmltv` or gzip-compressed `.gz` file containing XMLTV listings. The guide remains on the computer after Studio closes.

The importer accepts XMLTV channel IDs, programme titles, descriptions, subtitles, categories and start/stop times. It understands full date/time values with numeric timezone offsets, UTC/GMT and BST. It accepts an external DTD declaration as text but does not download the DTD or expand custom XML entities. Files using internal entity definitions, unusual date formats or unsupported XML extensions may need conversion before importing.

Compressed files must be at most 20 MB, expanded XML at most 24 MB. The importer accepts up to 10,000 guide channels and 60,000 programme records.

## Match channels

Studio uses the **TVG ID** field in each channel record. The value must exactly match the XMLTV channel identifier. For example:

`tvg_id: news.gb` matches `<channel id="news.gb">`

Names that merely look alike are deliberately left unmatched. This avoids pairing the wrong schedule with a similarly named regional channel.

You can correct the TVG ID in **Edit channel** and save the library, or use **Match channels** to link a saved channel to a different guide ID without altering its CSV. The manual link takes precedence while it exists. Select the saved channel and an exact entry from the imported XMLTV catalogue, then choose **Save link**. **Remove link** returns to ordinary TVG ID matching.

The links are scoped to the currently selected library, stored in separate private files alongside the guide cache. They remain after importing a newer guide, so a discontinued guide ID may need to be changed or removed. Matching requires a saved library with no unsaved edits. The dialogue respects the current channel search and adult-visibility controls. It shows up to 120 choices in each list; narrow the search for larger libraries.

Multiple local channel variants can deliberately share one guide ID. Their programme listings appear separately in search results, while the underlying schedule is stored only once.

## Search and availability

The programme-guide panel shows currently running and upcoming programmes within 48 hours or seven days. Search looks through titles, subtitles, categories and descriptions. It returns up to 120 entries at once; adjust the query to narrow the results.

The normal channel filters and adult-visibility setting also apply to guide results. Channels hidden by the current view do not appear in the guide search.

Studio warns when the schedule has run beyond its last programme or when its local copy was imported more than seven days ago. **It does not refresh automatically.** Download a new schedule from an authorised provider and import it manually.

## Cache and privacy

Guide data is held in Studio's local `programme-guide/guide.json` file within its application data directory. Choose **Clear guide** to delete it. The cache stores programme descriptions and channel identifiers, not playlist credentials or the source file path. Manual matching files store the library and channel identifiers as a filename digest and mapping entries; they do not hold stream URLs. Clearing the programme guide does not remove manual links, which can be cleared individually in the matching dialogue.

The original XMLTV file is not modified, and no network connection is made for importing or searching the guide. Back up any guide files you need independently; replacing the cached guide replaces the previous schedule.

## Limits

The feature currently supports one locally imported guide at a time. It does not provide an interactive programme grid, recording schedules, remote XMLTV downloads, guide-based channel renaming or an EPG inside the native VLC extension. Programme entries without a stop time can be shown as upcoming but cannot be confidently identified as currently broadcasting once they have started.
