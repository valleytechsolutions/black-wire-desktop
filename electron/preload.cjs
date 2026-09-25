const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('blackwire',Object.freeze({
 loadState:()=>ipcRenderer.invoke('bw:load'),
 saveState:state=>ipcRenderer.invoke('bw:save',state),
 openSource:url=>ipcRenderer.invoke('bw:external',url),
 openOriginal:file=>ipcRenderer.invoke('bw:original',file),
 saveAsset:(file,name)=>ipcRenderer.invoke('bw:save-asset',file,name),
 exportBackup:json=>ipcRenderer.invoke('bw:export',json),
 platform:process.platform
}));
