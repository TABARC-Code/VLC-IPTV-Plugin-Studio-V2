# Changelog

## 3.4.1 — 28 October 2026

- Private temporary VLC playlists are deleted after VLC exits, when Studio closes, and during the next clean start after an interrupted run.
- VLC process-start failures now return a visible error instead of leaving an unhandled child-process event.
- IPC handlers reject calls outside the exact local Studio renderer.
- Import, save, export and play operations enforce the same 20,000-channel ceiling and bounded field lengths.
- Library changes, imports and window closure warn when edits are unsaved.
- Audience badges distinguish 18+ from XXX, while both remain hidden by default.
- Home Assistant bridge and Lovelace tests now form part of the repository release gate.

Graphical Electron and real VLC playback remain to be verified on end-user hardware.

## 3.1.0 — 18 October 2026

- Saved channel CSV format is compatible with the native VLC extension, including explicit 18+ and XXX audience metadata.
- Added local M3U import. Imported sources remain disabled pending review.
- Added a non-destructive duplicate review panel for stream URLs and guide identifiers.
- Added regression and syntax checks to repository CI.

Live playback and graphical operation still need real-hardware verification.

## 1.4.7 — 2026-10-14

### Added

- Secure Electron desktop foundation with a sandboxed renderer.
- Managed CSV library with native import, folder access and atomic saving.
- Category, country and language organisation, plus instant search.
- Explicit 18+ channel labelling and default-hidden visibility switch.
- Channel add/edit/delete workflow.
- M3U export and VLC launch for the currently visible, enabled channels.
- First-run usage notice, README, CSV reference and no-nonsense beginner’s guide.
- TABARC artwork and a restrained VLC-inspired charcoal/orange/lime interface.
- Core CSV/M3U tests and automated syntax checks.

### Changed from the original app

- Replaced the Python/Tkinter shell with modern JavaScript and Electron.
- Renamed `group` to the clearer `category`, while retaining import aliases.
- Kept playlist management separate from VLC playback instead of building a second media player badly.

### Known limits

- Release installers are not yet signed.
- VLC discovery needs platform testing beyond Windows.
- Provider-specific headers, EPG ingestion and DRM are outside this release.

