import { defineConfig } from 'electron-vite'
// import { resolve } from 'path'
// import { minifySync, type ESBuildOptions } from 'vite'
// import { transformSync } from 'esbuild'
import viteConfig from './vite.config'

const isBuild = process.env.NODE_ENV === 'production',
  minify = isBuild && {
    mangle: true,
    compress: {
      dropConsole: true,
      dropDebugger: true
    }
  }

export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
  return {
    main: {
      plugins: [
        // isBuild && {
        //   name: 'adm-zip',
        //   renderChunk(code, chunk) {
        //     if (chunk.name === 'adm-zip')
        //       return minifySync(chunk.fileName, code, {
        //         compress: (minify as Obj).compress,
        //         mangle: true,
        //         module: true
        //       }).code
        //   }
        // }
      ],
      build: {
        minify: isBuild,
        externalizeDeps: {
          exclude: isBuild ? ['adm-zip'] : []
        },
        rolldownOptions: {
          // input: {
          //   index: resolve(__dirname, 'electron/main.ts')
          // }
          output: {
            // format: 'es'
            minify,
            codeSplitting: {
              groups: [
                {
                  test: (id) => id.includes('/node_modules/adm-zip/'),
                  name: 'adm-zip'
                }
              ]
            }
          }
        }
        // outDir: 'dist/main'
      }
    },
    preload: {
      // plugins: [],
      build: {
        minify: isBuild,
        rolldownOptions: {
          // input: {
          //   index: resolve(__dirname, 'electron/preload.ts')
          // },
          output: {
            minify,
            format: 'cjs'
          }
        }
        // outDir: 'dist/preload'
      }
    },
    renderer: viteConfig({ command, mode, isSsrBuild, isPreview }) as any
  }
})
