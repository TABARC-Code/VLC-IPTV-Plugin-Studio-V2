# Validation and remaining limits

## 3.5.0 country and language filters

The native suite now checks exact country/language matches, combination with groups, populated VLC dropdown doubles and visible-list changes. Queueing, export and stale-selection checks continue through the same current-filter function. These tests do not prove that the additional row fits every VLC theme, DPI setting or translated desktop build; real in-player validation remains required.

## 3.4.1 local release-candidate checks

On Windows, all 20 Studio core tests passed under Node.js, including private temporary-playlist creation and cleanup, IPC origin comparison, 20,000-channel boundaries, field-size limits, CSV/M3U behaviour and duplicate review. Every Studio JavaScript file also passed Node’s syntax check. All 13 Home Assistant bridge and Lovelace tests passed.

The five Python tests were discovered but correctly skipped because they exercise the POSIX installers, not Windows. No Lua 5.1 runtime was available locally, so the updated native-extension test was not executed in this environment. The local package-manager wrapper also failed to complete a dependency vulnerability audit, so no local audit result is claimed. The repository release workflow remains responsible for Lua 5.1 syntax/regression checks and the Linux/macOS installer matrix before publication.

Electron rendering, unsaved-work prompts, real VLC process launch, temporary-file cleanup after a genuine VLC exit and stream playback have not been exercised on end-user hardware for 3.4.1. Automated tests establish data and boundary behaviour; they do not establish picture, sound or desktop integration.

## 1.5.1 macOS and Linux installation

The installer suite covers installation and upgrades in paths containing spaces and Unicode, default user paths, Linux XDG paths, both launchers from another working directory and invalid arguments. Five tests passed locally on Linux. The macOS CI job runs the four applicable tests on a macOS runner; the Linux-specific XDG test is skipped there. Release publication waits for both installer jobs and the Lua regression job.

These are actual filesystem/launcher checks, not graphical VLC tests. The new audience controls still require desktop validation on macOS and Linux. No Flatpak/Snap path discovery or sandbox compatibility is claimed.

## 1.5.0 audience-filter checks

The 28-scenario native suite passed locally under texlua (Lua 5.3), including optional/reordered metadata, invalid audience rejection, legacy group fallbacks, each exact category, XXX opt-in, disabled records, stale selections, filtered queue/export, the 1,000-row display cap and visibility reset on reopening. All four example CSVs parsed and the Linux install/upgrade preservation test passed. The restricted descriptor scan is included. CI runs the suite on Lua 5.1.

The new controls have not yet been exercised in a real VLC desktop session. Earlier desktop findings below apply to the earlier interface, not this new layout. Verify the Audience dropdown and Show XXX checkbox on desktop VLC before describing the new UI as platform-tested. Labels are supplied by the user; no automatic content classification is tested or claimed.

## Earlier automated checks

The 1.4.8 Lua source passed a Lua 5.1 syntax check and 18 regression scenarios, including VLC’s restricted descriptor scan, CSV quoting/BOM/CRLF handling, invalid rows, disabled records, filtering, playlist calls, preserved data after a failed reload, first-launch notice, source-path alias protection and export recovery. Packaged examples were parsed by the same implementation. The path tests include Windows-style comparisons; they do not establish Windows desktop support.

The Linux installer was tested in a temporary user data directory containing spaces. Reinstallation preserved the user’s CSV, backed up the old script and installed the branding and instructions. Shell launchers passed syntax checks.

## Real desktop check

The extension was discovered and activated in Linux VLC 3.0.23 with the Qt interface under a virtual X display. Its native dialog, logo, CSV load and Play selected callback were exercised. A generated local MPEG-TS fixture was handed to VLC and reached its demux/decoder path. The virtual display produced rendering warnings; this is not an end-to-end guarantee of video output on user hardware.

A local HTTP/HLS fixture could not be verified because the development environment’s proxy rejected loopback HTTP requests. No claim is made that a remote IPTV provider or HLS stream was successfully played. Windows/macOS installers and desktop UI remain untested on those systems, and VLC 4/mobile support is not claimed.

## Release gate

CI reruns Lua and installer checks before creating a versioned source ZIP. These checks validate extension logic and packaging. They do not certify the host’s codecs, screen-reader behaviour, high-DPI layout, provider authentication, regional availability or licensing rights.

Larger Studio features in ROADMAP.md remain planned. This source release is suitable for review and desktop testing; it should not be presented as a completed implementation of the entire development brief.
