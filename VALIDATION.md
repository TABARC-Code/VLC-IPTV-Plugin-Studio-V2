# Validation and remaining limits

## Automated checks

The 1.4.8 Lua source passed a Lua 5.1 syntax check and 18 regression scenarios, including VLC’s restricted descriptor scan, CSV quoting/BOM/CRLF handling, invalid rows, disabled records, filtering, playlist calls, preserved data after a failed reload, first-launch notice, source-path alias protection and export recovery. Packaged examples were parsed by the same implementation. The path tests include Windows-style comparisons; they do not establish Windows desktop support.

The Linux installer was tested in a temporary user data directory containing spaces. Reinstallation preserved the user’s CSV, backed up the old script and installed the branding and instructions. Shell launchers passed syntax checks.

## Real desktop check

The extension was discovered and activated in Linux VLC 3.0.23 with the Qt interface under a virtual X display. Its native dialog, logo, CSV load and Play selected callback were exercised. A generated local MPEG-TS fixture was handed to VLC and reached its demux/decoder path. The virtual display produced rendering warnings; this is not an end-to-end guarantee of video output on user hardware.

A local HTTP/HLS fixture could not be verified because the development environment’s proxy rejected loopback HTTP requests. No claim is made that a remote IPTV provider or HLS stream was successfully played. Windows/macOS installers and desktop UI remain untested on those systems, and VLC 4/mobile support is not claimed.

## Release gate

CI reruns Lua and installer checks before creating a versioned source ZIP. These checks validate extension logic and packaging. They do not certify the host’s codecs, screen-reader behaviour, high-DPI layout, provider authentication, regional availability or licensing rights.

The larger studio features in ROADMAP.md are still planned. This source release is suitable for review and desktop testing; it should not be presented as a completed implementation of the entire development brief.
