# Contributing

Start with a reproducible issue or a small improvement. Describe what a user does, what happens and what you expected. Remove access tokens, passwords and personal channel databases from examples.

Keep Lua 5.1-compatible syntax and the restricted descriptor scan in mind. Preserve source CSVs and avoid host-level surprises: queueing should not clear a playlist or begin playback. Add a regression check when fixing parsing, persistence or export behaviour.

Use short comments where they explain a choice. Record actual decisions and fixes rather than invented months of history. Documentation uses UK English and should describe the release that exists. A feature belongs on the roadmap until the code and validation support it.

Run the checks in DEVELOPER_GUIDE.md. Include meaningful validation and outstanding platform limits with a pull request. Use semantic versioning; the maintainer decides release timing after reviewing the change.
