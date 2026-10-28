# VLC IPTV Plugin Studio V2

## GitHub description

A native VLC 3 Lua extension for CSV IPTV lists: search, group filters, selected-channel playback, queueing and M3U export, with beginner guides and worked examples.

## What this release is

IPTV Channel Player V2 runs inside desktop VLC. It keeps your channel data in an ordinary CSV and hands streams directly to VLC’s player. Python is not involved in normal installation or playback.

I have kept the first Studio V2 release deliberately small enough to inspect. CSV loading is validated before it replaces the visible list; playlist exports retain an existing file as a backup. The larger studio specification is recorded in ROADMAP.md, including database indexing, EPG and richer organisation. Those features are plans, not boxes ticked by an enthusiastic README.

The source release starts at v1.4.7 under the TABARC-Code brand. It is an independently developed VLC extension, not a VideoLAN-certified product. Users supply their own authorised streams.
