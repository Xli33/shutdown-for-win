import { ipcRenderer, contextBridge } from 'electron'

// contextBridge.exposeInMainWorld('ipcRenderer', {
//   on(...args: Parameters<typeof ipcRenderer.on>) {
//     const [channel, listener] = args
//     return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
//   },
//   off(...args: Parameters<typeof ipcRenderer.off>) {
//     const [channel, ...omit] = args
//     return ipcRenderer.off(channel, ...omit)
//   },
//   send(...args: Parameters<typeof ipcRenderer.send>) {
//     const [channel, ...omit] = args
//     return ipcRenderer.send(channel, ...omit)
//   },
//   invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
//     const [channel, ...omit] = args
//     return ipcRenderer.invoke(channel, ...omit)
//   }
// })

contextBridge.exposeInMainWorld('electronAPI', {
  minimize() {
    ipcRenderer.send('minimize')
  },
  // maximize() {
  //   ipcRenderer.send('maximize')
  // },
  toggleMaximize() {
    ipcRenderer.send('toggleMaximize')
  },
  // 设置定时关机，second < 0时直接取消定时
  setShutdown: (second: number) => ipcRenderer.invoke('setShutdown', second),
  // 尝试调用默认浏览器打开url
  open: (url: string) => ipcRenderer.send('openUrl', url),
  // update
  updatePkg: (file: File) => ipcRenderer.invoke('updatePkg', file),
  restart() {
    ipcRenderer.send('restart')
  }
})

ipcRenderer.on('maximize', () => {
  window.dispatchEvent(new Event('maximize'))
})
ipcRenderer.on('unmaximize', () => {
  window.dispatchEvent(new Event('unmaximize'))
})
// ipcRenderer.once('getVer', (e, version: string) => {
//   contextBridge.exposeInMainWorld('ver', version)
// })

window.addEventListener('DOMContentLoaded', () => {
  console.log(process)
})
