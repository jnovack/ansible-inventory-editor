const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  selectHostsFile: () => ipcRenderer.invoke('select-hosts-file'),
});
