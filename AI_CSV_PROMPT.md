# Optional AI prompt for creating your channel CSV

Copy the prompt below into your preferred AI assistant. Give it channel details you already have, or ask for a disabled category template. The extension itself does not contact an AI service.

Use public URLs or placeholders in the prompt. Put private passwords and access tokens into your local CSV afterwards. AI can help with formatting; it cannot grant permission to watch a channel or reliably invent a working stream.

## Copy this prompt

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
