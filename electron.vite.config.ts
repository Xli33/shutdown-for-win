import { defineConfig, defineViteConfig /* externalizeDepsPlugin */ } from 'electron-vite'
// import { resolve } from 'path'
import viteConfig from './vite.config'

const isProd = process.env.NODE_ENV === 'production'

export default defineConfig({
  main: {
    // plugins: [externalizeDepsPlugin()],
    build: {
      minify: isProd,
      rollupOptions: {
        // input: {
        //   index: resolve(__dirname, 'electron/main.ts')
        // }
        // output: {
        //   format: 'es'
        // }
      }
      // outDir: 'dist/main'
    }
  },
  preload: {
    // plugins: [externalizeDepsPlugin()],
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
    }
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
