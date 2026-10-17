# Lovelace dashboard

An optional camera interface for Home Assistant. The card lists camera entities already available to the signed-in Home Assistant user. It does not talk directly to VLC, ask for tokens or create streams.

The interface uses Home Assistant's card element and theme variables: card colour, foreground colour, secondary text, icon colour, borders, focus and error colour. It does not override your dashboard theme.

## Install the camera list card

1. Copy **iptv-camera-list.js** to your Home Assistant configuration's `www` directory, for example `<config>/www/iptv-camera-list.js`.
2. In Home Assistant, open **Settings > Dashboards > Resources** (or manage resources through dashboard settings on your installation).
3. Add `/local/iptv-camera-list.js` as a **JavaScript module** resource.
4. Reload the browser. In a dashboard, add a Manual card using:

~~~yaml
type: custom:tabarc-camera-list
title: Home cameras
show_search: true
show_unavailable: true
show_state: true
~~~

It automatically lists camera entities that Home Assistant exposes in the current session. Selecting an entry opens Home Assistant's built-in entity detail dialogue, including available camera controls and viewing features.

To show only chosen cameras, supply an optional allowlist:

~~~yaml
type: custom:tabarc-camera-list
title: Workshop cameras
entities:
  - camera.workshop
  - camera.front_door
show_unavailable: false
~~~

Supported settings: `title` (text), `show_search`, `show_unavailable`, `show_state` (true/false) and `entities` (camera entity ID list).

## Live-camera grid without a custom card

If you want video thumbnails in Lovelace, use Home Assistant's built-in picture-entity cards:

~~~yaml
type: grid
columns: 2
square: false
cards:
  - type: picture-entity
    entity: camera.front_door
    camera_view: live
    tap_action:
      action: more-info
  - type: picture-entity
    entity: camera.workshop
    camera_view: live
    tap_action:
      action: more-info
~~~

Change the entity IDs to match your installation. `camera_view: live` requires a compatible camera and Home Assistant streaming support. Live previews use extra bandwidth. These are native cards and follow the active theme. They do not need the custom JavaScript resource.

`camera-dashboard.yaml` combines the optional camera list and a native live-view grid. It is an example dashboard configuration, not a file to insert into `configuration.yaml`.

## Boundaries and security

- The custom card reads existing `hass.states` for the logged-in Home Assistant session. Camera names are rendered as text, not executable HTML.
- Clicking a camera opens Home Assistant's own more-info dialogue. It does not control VLC or take snapshots.
- No separate token, password, HTTP server, camera proxy URL or authentication bypass is involved.
- No camera stream is transmitted by the custom card. Home Assistant handles viewing.
- Do not expose VLC Telnet to the internet. Any later VLC control functions must have explicit authentication and user opt-in.

## Validation

Unit tests cover camera filtering, theme CSS references, configuration checks and entity-detail event dispatch. Browser rendering, themes, mobile layouts and live playback need an actual Home Assistant session for final validation.

References:
- https://developers.home-assistant.io/docs/frontend/custom-ui/custom-card/
- https://www.home-assistant.io/dashboards/picture-entity/
