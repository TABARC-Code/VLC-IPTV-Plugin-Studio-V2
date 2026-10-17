# Home Assistant Camera Bridge

An optional companion for IPTV Channel Player V2. The first stage lists Home Assistant camera entities without changing the existing VLC extension, desktop library or Home Assistant configuration.

## Current scope

The command queries Home Assistant's REST API for camera entities and prints their entity IDs, friendly names and states. It deliberately does not copy access tokens, camera proxy URLs, entity pictures or other attributes into its output.

No stream is created or played yet. A Home Assistant camera entity alone does not guarantee a stable RTSP or HTTP address usable by VLC. A later stage can associate selected entities with explicitly configured RTSP sources or go2rtc streams.

## Lovelace dashboard

The optional [Lovelace card and native dashboard examples](lovelace/README.md) provide a theme-aware camera directory and live-camera cards inside Home Assistant. Camera discovery uses the existing Home Assistant session, without a separate dashboard token. This is independent of VLC playback control.

## Requirements

- Node.js 20 or later.
- A reachable Home Assistant instance.
- A Home Assistant long-lived access token belonging to an appropriately restricted account.

From this directory, configure HA_URL and HA_TOKEN as environment variables, then run:

~~~sh
npm run cameras
npm test
~~~

The default requires HTTPS. For an HTTP Home Assistant instance on a private LAN, explicitly set HA_ALLOW_LOCAL_HTTP=1 as well. HTTP carries the token without transport encryption, so use it only on a network you trust. Never expose the Home Assistant API or VLC's Telnet interface to the public internet.

Example output:

~~~json
{
  "count": 1,
  "cameras": [
    {
      "entity_id": "camera.front_door",
      "name": "Front Door",
      "state": "idle"
    }
  ]
}
~~~

This command makes a read-only API request. It does not persist or print the supplied token. Avoid committing local configuration, tokens, exported camera URLs or playlists with credentials.

## Integration boundary

- Home Assistant supplies entities and automation events.
- go2rtc or the camera itself supplies playable media where configured.
- IPTV Studio manages the channel library.
- VLC handles playback.
- The native Lua extension remains optional and independent.

Before generating channel CSV files, the native extension and desktop Studio need a single agreed schema for group/category and audience/adult metadata. The bridge must not silently downgrade labels or leak ephemeral camera credentials.

## Next work

1. Add an explicit, user-reviewed camera-to-stream mapping.
2. Share a validated channel model with the existing desktop Studio and native VLC extension.
3. Support source health and reconnect behaviour through existing stream infrastructure.
4. Add opt-in Home Assistant events and VLC playback control with previous-channel restoration.
5. Exercise playback and installation on actual Windows, Linux and macOS VLC builds.

The project is intentionally separate from the original player until those contracts are proven.
