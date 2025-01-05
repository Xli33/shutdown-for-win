// Modules to control application life and create native browser window
import { app, BrowserWindow, ipcMain } from 'electron'
import { exec } from 'node:child_process'
import path from 'node:path'
// import { fileURLToPath } from 'node:url'

// const __dirname = path.dirname(fileURLToPath(import.meta.url))

let win: BrowserWindow
const createWindow = () => {
  if (win) {
    win.show()
    return
  }
  // Create the browser window.
  win = new BrowserWindow({
    width: 600,
    height: 600,
    frame: false,
    resizable: false,
    maximizable: false, // 禁用最大化后，app-region: drag 的元素也会无法通过双击最大化。但若应用已经最大化，则依旧可以通过双击退出最大化
    webPreferences: {
      // backgroundThrottling: false,
      preload: path.join(__dirname, '../preload/index.cjs')
      // sandbox: false
    }
  })

  // win.once('ready-to-show', () => {
  //   win.show()
  // })

  // 加载 index.html
  // You can use `process.env.VITE_DEV_SERVER_URL` when the vite command is called `serve`
  if (process.env.ELECTRON_RENDERER_URL) {
    win.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    // Load your file
    win.loadFile('out/renderer/index.html')
  }

  // 切换最大化后通知页面
  win.on('maximize', () => {
    win.webContents.send('maximize')
  })
  win.on('unmaximize', () => {
    win.webContents.send('unmaximize')
  })

  // 打开开发工具
  if (process.env.NODE_ENV === 'development') {
    win.webContents.openDevTools()
  }
}

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
  createWindow()

  ipcMain.on('minimize', () => {
    // 若有多个 窗口 时，通过 e.sender 获取对应的窗口
    // BrowserWindow.fromWebContents(e.sender)?.minimize()
    win.minimize()
  })
  // ipcMain.on('maximize', () => {
  //   win.maximize()
  // })
  ipcMain.on('toggleMaximize', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    win.isMaximized() ? win.unmaximize() : win.maximize()
  })
  // 设置定时关机，second小于0则仅取消定时
  ipcMain.handle(
    'setShutdown',
    (e, second: number) =>
      new Promise((resolve) => {
        exec('shutdown -a', (err) => {
          if (second < 0) {
            resolve(err)
          }
        })
        if (second > 0) {
          exec(`shutdown -s -f -t ${second}`, (err) => {
            // win!.webContents.send('changedShutdown', err)
            resolve(err)
          })
        }
      })
  )
  // ipcMain.on('setShutdown', (e, second: number) => {
  //   exec('shutdown -a')
  //   exec(`shutdown -s -f -t ${second}`, (err) => {
  //     win!.webContents.send('changedShutdown', err)
  //   })
  // })

  app.on('activate', () => {
    // 在 macOS 系统内, 如果没有已开启的应用窗口
    // 点击托盘图标时通常会重新创建一个新窗口
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此, 通常
// 对应用程序和它们的菜单栏来说应该时刻保持激活状态,
// 直到用户使用 Cmd + Q 明确退出
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// 在当前文件中你可以引入所有的主进程代码
// 也可以拆分成几个文件，然后用 require 导入。
