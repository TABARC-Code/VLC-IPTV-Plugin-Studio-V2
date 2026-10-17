# Install for the current Windows user. The channel CSV is theirs; never replace it on an update.
$ErrorActionPreference = 'Stop'
$target = Join-Path $env:APPDATA 'vlc\lua\extensions'
$assets = Join-Path $target 'iptv-channel-player-assets'
$script = Join-Path $target 'iptv-channel-player.lua'
New-Item -ItemType Directory -Force -Path $assets | Out-Null
if (Test-Path -LiteralPath $script) {
    Copy-Item -LiteralPath $script -Destination ($script + '.backup-' + [guid]::NewGuid().ToString('N'))
}
Copy-Item -LiteralPath (Join-Path $PSScriptRoot 'iptv-channel-player.lua') -Destination $script -Force
Copy-Item -LiteralPath (Join-Path $PSScriptRoot 'iptv-channel-player-assets\brand.png') -Destination (Join-Path $assets 'brand.png') -Force
Copy-Item -LiteralPath (Join-Path $PSScriptRoot 'README.md') -Destination (Join-Path $assets 'README.md') -Force
foreach ($name in @('CSV_GUIDE.md', 'IDIOTS_GUIDE.md')) {
    Copy-Item -LiteralPath (Join-Path $PSScriptRoot $name) -Destination (Join-Path $assets $name) -Force
}
$csv = Join-Path $assets 'channels.csv'
if (-not (Test-Path -LiteralPath $csv)) {
    Copy-Item -LiteralPath (Join-Path $PSScriptRoot 'iptv-channel-player-assets\channels.csv') -Destination $csv
}
Write-Host 'Installed IPTV Channel Player V2 for your Windows account.'
Write-Host 'Close and reopen VLC 3, then choose View > IPTV Channel Player V2.'
Write-Host 'Your CSV is at:' $csv
Write-Host 'The sample channels are disabled placeholders. Edit the CSV before trying playback.'
