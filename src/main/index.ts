// Modules to control application life and create native browser window
import { app, BrowserWindow, ipcMain, shell } from 'electron'
import { exec } from 'node:child_process'
import path from 'node:path'
import admZip from 'adm-zip'
import { rm } from 'node:fs/promises'
// import { fileURLToPath } from 'node:url'

// const __dirname = path.dirname(fileURLToPath(import.meta.url))

const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  // 只有第一次运行时gotTheLock应该是true，false说明重复运行，直接退出以保证只有单例运行
  app.exit()
  process.exit()
} else {
  let win: BrowserWindow

  app.on('second-instance', (/* event, commandLine, workingDirectory, additionalData */) => {
    // 输出从第二个实例中接收到的数据
    // console.log(additionalData)

    // 有人试图运行第二个实例，我们应该关注我们的窗口
    if (win) {
      // if (win.isMinimized()) win.restore()
      // win.focus()
      win.show()
    }
  })

  const createWindow = () => {
    // Create the browser window.
    win = new BrowserWindow({
      width: 600,
      height: 600,
      frame: false,
      titleBarStyle: 'hidden',
      titleBarOverlay: {
        color: 'rgba(0,0,0,0)',
        symbolColor: '#fff'
        // height: 32
      },
      // show: false,
      resizable: false,
      // fullscreenable: false, // 禁用F11切换全屏
      maximizable: false, // 禁用最大化后，app-region: drag 的元素也会无法通过双击最大化。但若应用已经最大化，则依旧可以通过双击退出最大化
      backgroundMaterial: 'acrylic',
      // backgroundColor: '#1976d2',
      // type: 'toolbar',
      // skipTaskbar: true,
      // transparent: true,
      webPreferences: {
        webSecurity: process.env.NODE_ENV !== 'development',
        allowRunningInsecureContent: false,
        // backgroundThrottling: false,
        preload: path.join(__dirname, '../preload/index.cjs')
        // sandbox: false
      }
    })
    // 去除electron默认附加的菜单，对应功能的快捷键也自然不存在也不会生效了，使用win.setMenu(null)效果一致
    win.removeMenu()
    // win.once('ready-to-show', () => {
    //   win.show()
    // })

    // 加载 index.html
    // You can use `process.env.VITE_DEV_SERVER_URL` when the vite command is called `serve`
    if (process.env.ELECTRON_RENDERER_URL) {
      win.loadURL(process.env.ELECTRON_RENDERER_URL)
    } else {
      // Load your file
      win.loadFile('out/renderer/index.html', {
        hash: '#/home'
      })
    }
    // win.webContents.once('did-start-loading', () => {
    //   win.webContents.send('getVer', app.getVersion())
    // })
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

  // Menu.setApplicationMenu(null)
  // 这段程序将会在 Electron 结束初始化
  // 和创建浏览器窗口的时候调用
  // 部分 API 在 ready 事件触发后才能使用。
  app.whenReady().then(() => {
    // electron应用默认带有一些菜单，其中包括浏览器默认的F11-切换全屏，禁用该默认行为的方式之一是注册个空函数的全局快捷键
    // globalShortcut.register('F11', () => {})
    createWindow()

    ipcMain.once('restart', () => {
      app.relaunch()
      app.exit()
    })
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
    // update
    ipcMain.handle(
      'updatePkg',
      (e, file: ArrayBuffer) =>
        new Promise<void>((resolve, reject) => {
          // console.log('to update:', file, file + '', new File([file], 'a.txt'))
          // writeFileSync('./app-new/123.zip', file)
          const zip = new admZip(Buffer.from(file))
          console.log(JSON.stringify(zip.getEntry('app/package.json'), null, 2))
          rm('./resources/app', {
            force: true,
            recursive: true
          })
            .then(() => {
              zip.extractAllTo('./resources/', true)
              resolve()
            })
            .catch((err) => {
              reject(err)
            })
        })
    )
    // ipcMain.on('setShutdown', (e, second: number) => {
    //   exec('shutdown -a')
    //   exec(`shutdown -s -f -t ${second}`, (err) => {
    //     win!.webContents.send('changedShutdown', err)
    //   })
    // })
    // open url
    ipcMain.on('openUrl', (e, url: string) => shell.openExternal(url))

    app.on('activate', () => {
      // 在 macOS 系统内, 如果没有已开启的应用窗口
      // 点击托盘图标时通常会重新创建一个新窗口
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

    // 若需支持后台则使用托盘以供交互
    // const tray = new Tray(path.join(__dirname, '../../resources/icon.ico'))
    // const contextMenu = Menu.buildFromTemplate([
    //   {
    //     type: 'normal',
    //     label: '退出',
    //     click() {
    //       app.quit()
    //     }
    //   }
    // ])
    // tray.setToolTip('shutdown')
    // tray.setContextMenu(contextMenu)
    // // tray.on('mouse-enter', () => {
    // //   try {
    // //     win.isEnabled()
    // //   } catch (err: any) {
    // //     tray.setToolTip(
    // //       1 +
    // //         ': ' +
    // //         err.stack.slice(0, 20) +
    // //         '\n2: ' +
    // //         (err.message === 'Object has been destroyed')
    // //     )
    // //   }
    // // })
    // tray.on('click', (e, b, p) => {
    //   try {
    //     win.isVisible() ? win.hide() : win.show()
    //   } catch (error: any) {
    //     error.message === 'Object has been destroyed' && createWindow()
    //   }
    // })
  })

  // 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此, 通常
  // 对应用程序和它们的菜单栏来说应该时刻保持激活状态,
  // 直到用户使用 Cmd + Q 明确退出
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })

  // 在当前文件中你可以引入所有的主进程代码
  // 也可以拆分成几个文件，然后用 require 导入。
}
