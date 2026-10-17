# Developer guide and extension API

## Why Lua

The native VLC extension API supports Lua descriptors, lifecycle callbacks, dialogs and playlist operations. That is the technical reason for using Lua here despite the brief’s Rust/C++ preference. A compiled VLC module and an embedded GUI extension are different integration surfaces; choosing C++ would not automatically make these controls more native.

The deployable extension stays self-contained so the user copies one script and its assets. Pure parsing/filter/export helpers are separated logically from host callbacks. A future indexed studio can use a Rust core if measured requirements justify it; 1.4.7 does not claim to contain that core.

## Entry points

- descriptor() supplies literal metadata and an embedded PNG. VLC scans it without standard Lua libraries.
- activate() creates one native VLC dialog and loads an existing remembered/default CSV if present.
- deactivate() deletes widgets and clears session data.
- close() asks VLC to deactivate the extension.
- meta_changed() accepts metadata events sent by some VLC 3 builds.

Button callbacks load/reload CSV, refresh filters, play/queue selected rows, queue filtered rows, export M3U and show guides. They run in VLC’s extension context. Network fetching and background watcher threads are outside this release.

## Testable helpers

| Helper | Contract |
| --- | --- |
| IPTV.csv_line(line) | Return fields or nil/error for one physical CSV line |
| IPTV.parse_csv(data) | Return validated rows or nil/error, without changing active data |
| IPTV.filter(rows, query, group, show_disabled, audience, include_xxx) | Return original row indices using literal search and exact audience; XXX excluded unless opted in |
| IPTV.m3u(rows, audience, include_xxx) | Return extended M3U text and enabled record count; XXX excluded unless opted in |
| IPTV.write_m3u(path, content, allow_replace) | Write a new export or back up/replace an existing file; return success/detail |
| IPTV.path_key(path, windows) | Normalise dot segments and path separators; apply Windows-style case comparison when requested |
| IPTV.same_path(left, right) | Use VLC's URI helper to resolve relative paths when available, then compare normalised path keys |

The optional audience column accepts cartoons, 12+, 16+, 18+, xxx and unrated, ignoring case. Blank/missing values use exact legacy group labels or Unrated. IPTV.audience(row) resolves the label; IPTV.audience_matches(row, audience, include_xxx) applies the visibility preference. The dropdown and checkbox use existing VLC dialog APIs. All playlist callbacks recheck current filters; bulk operations work on all matches, not the capped list.

ID uniqueness and mandatory field checks precede a successful reload. CSV source files are never changed by these helpers. Search is bounded by input size; the native list has a separate display cap. M3U replacement uses a same-directory temporary file, backup and attempted rollback. These operations assume one writer; they are not a database transaction system.

## Run checks

Use Lua 5.1 or newer with the regression harness. Create a fresh temporary directory, then run:

```sh
lua5.1 tests/test_extension.lua . /tmp/iptv-tests
python3 -m unittest discover -s tests -v
```

Python is a development dependency for the Linux installer test, not a runtime dependency of the extension. CI also checks source syntax and sample CSVs. For real GUI validation, install into an isolated VLC profile, open the extension, load an anonymised fixture, exercise filters/queue/export and test an authorised stream.

## Versioning and releases

VERSION contains a plain semantic version, such as 1.4.7. The Lua descriptor uses v1.4.7 and GitHub tags use the same v prefix. Keep those values and CHANGELOG.md aligned when changing the version. Do not overwrite existing release tags or manufacture an earlier development history.

The release workflow runs checks before creating an installable ZIP. It does not sign installers, publish to VideoLAN’s add-on catalogue or certify Windows/macOS support.

## Reference

The VLC 3 Lua documentation and dialog bindings informed the implementation: https://github.com/videolan/vlc/tree/3.0.x/share/lua and https://github.com/videolan/vlc/blob/3.0.x/modules/lua/libs/dialog.c.
