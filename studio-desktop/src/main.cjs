'use strict';

const { app, BrowserWindow, dialog, ipcMain, shell } = require('electron');
const { spawn } = require('node:child_process');
const fs = require('node:fs/promises');
const fsSync = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const crypto = require('node:crypto');
const { MAX_CSV_BYTES, m3u, readChannels, writeChannels } = require('./core/channels.cjs');
const { parseM3u } = require('./core/m3u.cjs');

const VERSION = '1.4.7';
let window;
let customVlcPath = null;

if (process.env.STUDIO_CAPTURE_PATH && !app.isPackaged) {
  app.setPath('userData', path.join(path.dirname(process.env.STUDIO_CAPTURE_PATH), 'capture-profile'));
}

function libraryDir() {
  return path.join(app.getPath('userData'), 'libraries');
}

function safeLibraryName(value) {
  const name = path.basename(String(value || '')).replace(/[^a-z0-9._ -]/gi, '_');
  if (!name.toLowerCase().endsWith('.csv')) return `${name || 'channels'}.csv`;
  return name;
}

async function ensureLibrary() {
  await fs.mkdir(libraryDir(), { recursive: true });
}

async function atomicWrite(filePath, contents) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const temporary = `${filePath}.${crypto.randomUUID()}.tmp`;
  try {
    await fs.writeFile(temporary, contents, { encoding: 'utf8', mode: 0o600 });
    await fs.rename(temporary, filePath);
  } finally {
    await fs.rm(temporary, { force: true }).catch(() => {});
  }
}

function vlcCandidates() {
  if (process.platform === 'win32') {
    return [
      process.env.ProgramFiles && path.join(process.env.ProgramFiles, 'VideoLAN', 'VLC', 'vlc.exe'),
      process.env['ProgramFiles(x86)'] && path.join(process.env['ProgramFiles(x86)'], 'VideoLAN', 'VLC', 'vlc.exe')
    ].filter(Boolean);
  }
  if (process.platform === 'darwin') return ['/Applications/VLC.app/Contents/MacOS/VLC'];
  return ['/usr/bin/vlc', '/usr/local/bin/vlc', '/snap/bin/vlc'];
}

function findVlc() {
  return customVlcPath || vlcCandidates().find(candidate => fsSync.existsSync(candidate)) || null;
}

async function createWindow() {
  window = new BrowserWindow({
    width: 1320,
    height: 820,
    minWidth: 960,
    minHeight: 640,
    backgroundColor: '#101314',
    icon: path.join(__dirname, '..', 'assets', 'icon.png'),
    title: `TABARC VLC IPTV Studio ${VERSION}`,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      devTools: !app.isPackaged
    }
  });
  await window.loadFile(path.join(__dirname, 'renderer', 'index.html'));
  window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  window.webContents.on('will-navigate', event => event.preventDefault());

  if (process.env.STUDIO_CAPTURE_PATH && !app.isPackaged) {
    const example = await fs.readFile(path.join(__dirname, '..', 'channels.example.csv'), 'utf8');
    await atomicWrite(path.join(libraryDir(), 'channels.example.csv'), example);
    await window.webContents.executeJavaScript("localStorage.setItem('usage-notice-v1', 'accepted')");
    await window.webContents.reload();
    await new Promise(resolve => setTimeout(resolve, 700));
    await window.webContents.executeJavaScript("const s=document.querySelector('#libraries');s.value='channels.example.csv';s.dispatchEvent(new Event('change',{bubbles:true}))");
    await new Promise(resolve => setTimeout(resolve, 700));
    await window.webContents.executeJavaScript("window.scrollTo(0,0);document.querySelector('.sidebar').scrollTo(0,0)");
    const screenshot = await window.webContents.capturePage();
    await fs.writeFile(process.env.STUDIO_CAPTURE_PATH, screenshot.toPNG());
    app.quit();
  }
}

ipcMain.handle('app:info', async () => ({ version: VERSION, platform: process.platform, vlcFound: Boolean(findVlc()) }));

ipcMain.handle('library:list', async () => {
  await ensureLibrary();
  const entries = await fs.readdir(libraryDir(), { withFileTypes: true });
  return entries.filter(entry => entry.isFile() && entry.name.toLowerCase().endsWith('.csv')).map(entry => entry.name).sort();
});

ipcMain.handle('library:choose-csv', async () => {
  const result = await dialog.showOpenDialog(window, {
    title: 'Import a channel CSV', properties: ['openFile'], filters: [{ name: 'Channel CSV', extensions: ['csv'] }]
  });
  if (result.canceled) return null;
  const source = result.filePaths[0];
  const stat = await fs.stat(source);
  if (stat.size > MAX_CSV_BYTES) throw new Error('That CSV is larger than 20 MB.');
  const text = await fs.readFile(source, 'utf8');
  const channels = readChannels(text);
  await ensureLibrary();
  let name = safeLibraryName(path.basename(source));
  const parsed = path.parse(name);
  let suffix = 2;
  while (fsSync.existsSync(path.join(libraryDir(), name))) name = `${parsed.name}-${suffix++}${parsed.ext}`;
  await atomicWrite(path.join(libraryDir(), name), writeChannels(channels));
  return { name, channels };
});

ipcMain.handle('library:choose-m3u', async () => {
  const result = await dialog.showOpenDialog(window, {
    title: 'Import a local channel playlist', properties: ['openFile'],
    filters: [{ name: 'M3U playlist', extensions: ['m3u', 'm3u8'] }]
  });
  if (result.canceled) return null;
  const source = result.filePaths[0];
  const stat = await fs.stat(source);
  if (stat.size > MAX_CSV_BYTES) throw new Error('That playlist is larger than 20 MB.');
  const channels = parseM3u(await fs.readFile(source, 'utf8'));
  await ensureLibrary();
  let name = safeLibraryName(path.parse(source).name + '.csv');
  const parsed = path.parse(name);
  let suffix = 2;
  while (fsSync.existsSync(path.join(libraryDir(), name))) name = `${parsed.name}-${suffix++}${parsed.ext}`;
  await atomicWrite(path.join(libraryDir(), name), writeChannels(channels));
  return { name, channels };
});

ipcMain.handle('library:load', async (_event, requestedName) => {
  const name = safeLibraryName(requestedName);
  const text = await fs.readFile(path.join(libraryDir(), name), 'utf8');
  return { name, channels: readChannels(text) };
});

ipcMain.handle('library:save', async (_event, payload) => {
  const name = safeLibraryName(payload?.name);
  const output = writeChannels(payload?.channels || []);
  await atomicWrite(path.join(libraryDir(), name), output);
  return { name };
});

ipcMain.handle('library:open-folder', async () => {
  await ensureLibrary();
  const error = await shell.openPath(libraryDir());
  if (error) throw new Error(error);
  return true;
});

ipcMain.handle('vlc:choose', async () => {
  const result = await dialog.showOpenDialog(window, { title: 'Locate the VLC executable', properties: ['openFile'] });
  if (result.canceled) return null;
  customVlcPath = result.filePaths[0];
  return customVlcPath;
});

ipcMain.handle('vlc:launch', async (_event, payload) => {
  const executable = findVlc();
  if (!executable) return { needsVlc: true };
  const playlist = path.join(os.tmpdir(), `tabarc-iptv-${crypto.randomUUID()}.m3u`);
  await atomicWrite(playlist, m3u(payload?.channels || []));
  // Arguments remain arguments. A shell would only add excitement of the bad kind.
  const child = spawn(executable, ['--playlist-enqueue', '--', playlist], { detached: true, shell: false, stdio: 'ignore' });
  child.unref();
  return { launched: true };
});

ipcMain.handle('playlist:export', async (_event, payload) => {
  const result = await dialog.showSaveDialog(window, {
    title: 'Export playlist for VLC', defaultPath: 'tabarc-playlist.m3u', filters: [{ name: 'M3U playlist', extensions: ['m3u'] }]
  });
  if (result.canceled) return null;
  await atomicWrite(result.filePath, m3u(payload?.channels || []));
  return { path: result.filePath };
});

app.whenReady().then(async () => {
  await ensureLibrary();
  await createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });

