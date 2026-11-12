# Installing the desktop Studio

Studio is a separate desktop channel organiser. The native VLC extension remains available in its own ZIP, and VLC itself is still required for playback.

## Download the right file

Use the [V3.9.0 release](https://github.com/TABARC-Code/VLC-IPTV-Plugin-Studio-V2/releases/tag/v3.9.0) and choose the file for your system.

| System | Package | Installation |
| --- | --- | --- |
| Windows 64-bit | `tabarc-studio-3.9.0-win-x64.exe` | Open the setup executable, choose the installation folder and complete the wizard |
| macOS Intel | `tabarc-studio-3.9.0-mac-x64.dmg` | Open the disk image and move Studio into Applications |
| macOS Apple Silicon | `tabarc-studio-3.9.0-mac-arm64.dmg` | Open the disk image and move Studio into Applications |
| Linux 64-bit | `tabarc-studio-3.9.0-linux-x64.AppImage` | Make the file executable and run it |

On Linux, for example:

```sh
chmod +x tabarc-studio-3.9.0-linux-x64.AppImage
./tabarc-studio-3.9.0-linux-x64.AppImage
```

AppImage may need FUSE support on some Linux distributions. The package does not install VLC or supply streaming channels.

## Unsigned builds

These packages are **not code-signed or notarised**. Windows SmartScreen or macOS Gatekeeper may warn or block the first launch. An unsigned release is not proof that a file is unsafe, but it also offers no publisher identity guarantee. Only use the exact assets from the repository's releases and verify the supplied SHA-256 checksums.

The release pipeline builds on native GitHub-hosted Windows, macOS and Linux runners. It runs the code and regression checks before packaging. That is not a substitute for an independent security audit or hands-on playback on your system.

## Retaining libraries and settings

I keep libraries, recovery copies, local XMLTV schedules and programme-guide mappings under Electron's user-data directory, not inside the application bundle. Updating or uninstalling the application should not remove those files. The Windows wizard is configured not to delete application data on uninstall.

For extra safety, use **Open library folder** in Studio and copy the entire library folder elsewhere before upgrading. Keep those backups private: stream addresses may include provider credentials.

## Source installation

If you'd rather run Studio from source, open `studio-desktop`, use Node.js 22 or later, then run:

```sh
npm ci
npm test
npm run check
npm start
```

The native VLC extension works independently of Studio. Do not confuse `iptv-channel-player-native-v3.9.0.zip` with one of the desktop installers.
