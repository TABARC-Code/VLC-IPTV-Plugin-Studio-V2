# AI prompts: find IPTV sources and create your channel files

Copy the prompt below into your preferred AI assistant. Give it channel details you already have, or ask for a disabled category template. The extension itself does not contact an AI service.

Use public URLs or placeholders in the prompt. Put private passwords and access tokens into your local CSV afterwards. AI can help with formatting; it cannot grant permission to watch a channel or reliably invent a working stream.

## 1. Research sources before building the file

Use an AI assistant with web access for this step. If it cannot browse, ask it to say so rather than treating remembered links as current. The extension itself does not browse for channels or contact an AI service.

Copy this prompt:

```text
Research publicly available IPTV sources for News, Films, Animation/Cartoons, Children's channels and UK TV.

Prefer broadcaster-published stream information and maintained public playlist repositories. For every candidate, give the exact source page, playlist index URL, repository maintenance evidence and the actual licence-file URL. Quote the licence name from its text; a public repository or a README badge alone does not establish a reuse licence.

Distinguish repository/list licensing from rights to the destination broadcasts. Explain any relevant provider terms or access restrictions you can verify. Keep unsupported rights claims marked unknown.

Use current web evidence and give the date checked. Separate a URL found in an index from an endpoint actually checked, and separate both from successful media playback. Do not describe a feed as working merely because a page or HTTP request succeeded.
Never invent feeds, credentials, subscription access, EPG identifiers or rights. If browsing is unavailable, say what you could not check.

Return a short source table with citations and a list of candidate channel records for my review. Keep candidates disabled. Do not fetch private lists or request private account details.
```

[IPTV-SOURCES.md](IPTV-SOURCES.md) contains starting links and licence references. Review the research before moving to file creation. A plausible URL is still only a URL.

## 2. Create the CSV from reviewed details

```text
Format the channel details I supply as a UTF-8 comma-separated CSV for IPTV Channel Player V2.

Use this exact header and order:
id,name,group,country,language,stream_url,logo_url,tvg_id,enabled

Use one channel per row and a unique, stable id for each record.
Keep all fields on one physical line. Quote fields containing commas or quotation marks, and double quotation marks inside quoted fields.
Leave unknown optional metadata blank. Use recognised country/language codes only when known.
Use group names I supply; otherwise use a sensible category such as News, Films, Cartoons or UK TV.
Use only stream URLs I supply. Never invent working URLs, credentials, EPG identifiers or claims of permission.
If I have not supplied a URL, use https://example.org/placeholder.m3u8 and set enabled=false.
Use enabled=true only where I explicitly say that my supplied stream is authorised and should be active. Otherwise use false.
Do not substitute a broadcaster’s normal webpage for a stream URL.
Do not silently discard records with similar names; give variants separate IDs and leave decisions to me.
Return CSV text only, without a Markdown code fence, commentary or extra headings.

My channel details:
[Paste public channel names, groups, URLs and metadata here. Do not paste private access tokens.]
```

## If you only want a blank starting list

After the prompt, add: “Create four disabled placeholder records, one each for News, Films, Cartoons and UK TV. I will add my own authorised URLs later.”

Save the result as my-channels.csv in UTF-8. If your AI still wraps it in three backticks, remove those lines. Check the IDs and enabled values, then load it through the VLC extension. Keep a copy before making changes.

Use at your own risk. Verify the output, the source of every URL and your right to use it. Do not misuse the software or redistribute content unlawfully.

## 3. Optional M3U file

The native extension can export an M3U from your loaded CSV. Use that route if you already have the CSV in VLC: enter a separate .m3u filename and choose **Export M3U**. It includes every enabled row, regardless of the current filter. Keep the CSV as your editable source.

If you want an AI assistant to format the same records, use this prompt after reviewing the CSV:

```text
Convert the CSV I supply to an extended M3U playlist. Begin with #EXTM3U.
Include only rows with enabled=true. For each, output an #EXTINF line using the channel name, group-title, and any supplied tvg-id and tvg-logo, followed by its exact stream_url on the next line.
Preserve URL query strings exactly. Do not guess missing metadata or add channels. Flag malformed records and attribute values containing quotation marks or line breaks for correction rather than silently changing them.
Return the playlist separately from any validation report. If file creation is available, save it as my-channels.m3u in UTF-8.
```

A .m3u playlist opens directly in VLC or a compatible IPTV app. It does not load as a CSV in this extension. If the assistant cannot create downloads, copy only the playlist text into a UTF-8 plain text file with the .m3u extension.

## Usage and privacy

Do not misuse this software. Use only streams you are authorised to access and follow applicable laws, provider terms and licensing requirements, including a UK TV Licence where required. A repository licence does not license the destination broadcasts. Use at your own risk; source availability and playback are not guaranteed.

Do not upload your private channel database, credentials or token-bearing URLs to an AI service. Supply public metadata or placeholders, then add sensitive values locally. Check the assistant's data-handling terms before sharing anything. CSV files, M3U exports and their backups can all contain access tokens.
