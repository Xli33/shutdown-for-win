import { defineConfig, defineViteConfig, externalizeDepsPlugin } from 'electron-vite'
// import { resolve } from 'path'
import viteConfig from './vite.config'
import type { ESBuildOptions } from 'vite'

const isProd = process.env.NODE_ENV === 'production',
  esbuild: ESBuildOptions = {
    drop: isProd ? ['console', 'debugger'] : [] // 删除所有的console 和 debugger
  }

export default defineConfig({
  main: {
    // plugins: [externalizeDepsPlugin()],
    build: {
      minify: isProd,
      rollupOptions: {
        // input: {
        //   index: resolve(__dirname, 'electron/main.ts')
        // }
        output: {
          // format: 'es'
          manualChunks(id): string | void {
            if (id.includes('adm-zip')) {
              return 'adm-zip'
            }
          }
        }
      }
      // outDir: 'dist/main'
    },
    esbuild
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      minify: isProd,
      rollupOptions: {
        // input: {
        //   index: resolve(__dirname, 'electron/preload.ts')
        // },
        output: {
          format: 'cjs'
        }
      }
      // outDir: 'dist/preload'
    },
    esbuild
  },
  renderer: defineViteConfig((arg) => {
    return viteConfig(arg)
    // return Object.assign({}, viteConfig, {
    //   root: '.',
    //   build: {
    //     rollupOptions: {
    //       input: {
    //         index: resolve(__dirname, 'index.html')
    //       }
    //     }
    //     // outDir: 'dist/renderer'
    //   }
    // })
  })
})
