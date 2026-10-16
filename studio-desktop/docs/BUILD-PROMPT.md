# Reusable development prompt

Use this prompt for future maintenance turns:

> Continue TABARC-Code’s VLC IPTV Studio from the repository’s current version. Read `README.md`, `docs/DESIGN.md`, `docs/CSV-FORMAT.md`, `CHANGELOG.md` and the tests before changing code. Preserve the supplied TABARC flask artwork and the charcoal/orange/lime visual language. Treat the product as a local-first VLC companion, not a streaming service: never bundle channel feeds, credentials, DRM workarounds, access-control bypasses or content blacklists.
>
> Keep Electron’s renderer sandboxed with Node integration disabled. Validate all IPC input in the main process, use atomic writes, launch VLC with argument arrays and `shell: false`, and do not expose arbitrary filesystem or process APIs to the renderer. Maintain CSV compatibility aliases and the explicit, default-off 18+ visibility control.
>
> Improve the smallest coherent slice, add or update tests, and write an honest changelog entry. Use UK English, concrete labels and accessible controls. Comments should explain surprising constraints, not impersonate a diary. Do not fabricate release dates, historical commits, user numbers or completed work. If a future idea is already implemented, move it into the changelog rather than pretending an old note predicted it.
>
> Run `npm test` and `npm run check`. Report what was actually verified and what still needs platform testing in VLC. Prepare a focused pull request with screenshots when the interface changes.

