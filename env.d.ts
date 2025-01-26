/// <reference types="vite/client" />
/// <reference types="electron-vite/node" />

declare module '@yellowspot/vite-plugin-externals' {
  import type { PluginOption } from 'vite'
  export default function (param: Obj): PluginOption
}

declare interface Window {
  // [x: string]: any
  // ipcRenderer: {
  //   on(
  //     channel: string,
  //     listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void
  //   ): Electron.IpcRenderer
  //   off(
  //     channel: string,
  //     listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void
  //   ): Electron.IpcRenderer
  //   send(channel: string, ...args): void
  //   invoke(channel: string, ...args): Promise<any>
  // }
  ver: string
  electronAPI: {
    minimize(): void
    maximize(): void
    toggleMaximize(): void
    /**
     * @param second 大于0则设置定时关机，小于0直接取消定时
     */
    setShutdown(second: number): Promise<any>
    open(url: string): void
    // update package
    updatePkg(file: ArrayBuffer): Promise<void>
    restart(): void
  }
  /**
   * 用于在modal切换后调整Bar的app-region
   *  */
  onModalChange: (hidden: boolean) => void
}

declare interface Obj {
  [x: string]: any
}

declare type nullish = undefined | null
