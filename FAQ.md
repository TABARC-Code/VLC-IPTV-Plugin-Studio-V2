# Frequently asked questions

## Is this inside VLC?

Yes. VLC loads the Lua extension and creates its dialog. Normal use does not launch Python or a separate application. The older Python companion is a different project.

## Does it work on phones or VLC 4?

This release targets desktop VLC 3. Mobile VLC and VLC 4 have not been validated. Windows/macOS scripts are supplied, but their desktop behaviour still needs verification. Linux VLC 3.0.23 discovery and activation were checked during development.

## Are channels included?

Only disabled placeholder records. Supply your own authorised stream URLs. A public list or free download does not itself establish viewing or redistribution rights.

## Why is the interface using VLC’s colours?

VLC owns the extension’s native widgets. This release follows the host theme. A custom dark/light studio interface is on the roadmap; it is not secretly enabled somewhere.

## Can it import M3U, fetch EPG or edit the CSV?

Not in this native release. It reads CSV and exports M3U. Edit externally or use the separate companion’s existing tools. The broader import, database and EPG features are planned.

## Why did export leave a backup?

It preserved the existing playlist before replacing it. Delete an old backup yourself once you are satisfied, particularly if it contains tokens. If an export fails after backing up, recovery is attempted and the status tells you when manual recovery is needed.

## Why are only some channels visible?

The filter or enabled state may exclude them. Display is capped at 1,000 matching records; refine the search. Input is limited to 2 MiB and 20,000 records. Queue filtered and export use enabled records matching the current controls, including matches beyond the display cap.

## What should a bug report include?

Version, operating system, VLC build, exact steps and a small anonymised CSV reproducing the issue. Remove credentials and private URLs first. Avoid posting your complete personal database.

## Why are my XXX channels missing?

XXX is hidden on every opening. Tick Show XXX and press Apply filter; Show all also respects that checkbox. Check the audience column or recognised group name. Blank or unknown groups fall into Unrated unless audience supplies a label. This is a visibility preference, not a parental lock or verified age rating.
