# Design and product rationale

## Character

V2 borrows VLC’s practical, technical confidence rather than photocopying its interface. Charcoal panels and a warm orange playback action nod towards the player. TABARC’s acid-lime flask mark remains the author signature. The result should feel like equipment: legible, quick and mildly industrial.

No VLC cone appears in the app. “VLC” describes compatibility, while the first-run notice and README make the lack of affiliation explicit.

## Iconography

Lucide supplies a consistent 24-pixel outline vocabulary under the ISC licence. Icons accompany text on consequential actions—import, export, save and play—because a tiny abstract glyph should not become an entrance exam. Icon-only row actions have accessible names and tooltips supplied by the browser.

## Interaction model

The library is the durable object. Search and facet filters create a temporary view. **Play visible in VLC** and **Export M3U** use that view, so users can make a country- or category-specific playlist without duplicating their source data.

Adult-labelled channels are ordinary records with an `adult` boolean. They are hidden at startup and revealed by an explicit switch. The application does not maintain a content blacklist or attempt to classify streams.

## Security boundary

- Context isolation and renderer sandboxing are enabled.
- Node integration is disabled in the renderer.
- A small preload bridge exposes specific actions instead of a generic IPC pipe.
- CSV files are size-limited and parsed before entering the managed library.
- Saves use a temporary file and rename.
- VLC is launched with an argument array and `shell: false`.
- Navigation and new windows are blocked.
- Content Security Policy allows only local scripts/styles and HTTPS/data images.

Remote channel logos are optional. They may reveal a request to the logo host; privacy-sensitive users can leave `logo_url` blank.

## Accessibility

The interface has visible focus, native controls, a skip link, a live status region, labelled icon buttons and no colour-only state. Search has a `/` shortcut. Filters remain checkboxes rather than clever custom widgets; the latter are often accessibility bugs wearing a nice coat.

## Why Electron, for now

Rust/Tauri would reduce the packaged footprint, but Rust is not available in the current development environment. Electron makes v1.4.7 runnable and testable now. The business logic is kept in a small CommonJS module so a later native shell can replace Electron without rewriting CSV semantics.

