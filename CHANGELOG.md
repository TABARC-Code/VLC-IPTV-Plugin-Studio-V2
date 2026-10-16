# Changelog

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

