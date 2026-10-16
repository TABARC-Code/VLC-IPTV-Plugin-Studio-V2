'use strict';

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('studio', Object.freeze({
  appInfo: () => ipcRenderer.invoke('app:info'),
  chooseCsv: () => ipcRenderer.invoke('library:choose-csv'),
  listLibraries: () => ipcRenderer.invoke('library:list'),
  loadLibrary: name => ipcRenderer.invoke('library:load', name),
  saveLibrary: payload => ipcRenderer.invoke('library:save', payload),
  openLibraryFolder: () => ipcRenderer.invoke('library:open-folder'),
  launchVlc: payload => ipcRenderer.invoke('vlc:launch', payload),
  chooseVlc: () => ipcRenderer.invoke('vlc:choose'),
  exportPlaylist: payload => ipcRenderer.invoke('playlist:export', payload)
}));

