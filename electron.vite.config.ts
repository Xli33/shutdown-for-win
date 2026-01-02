import { defineConfig } from 'electron-vite'
// import { resolve } from 'path'
import type { ESBuildOptions } from 'vite'
import { transformSync } from 'esbuild'
import viteConfig from './vite.config'

const isProd = process.env.NODE_ENV === 'production',
  esbuild: ESBuildOptions = {
    drop: isProd ? ['console', 'debugger'] : [] // 删除所有的console 和 debugger
  }

export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
  return {
    main: {
      plugins: [
        isProd && {
          name: 'adm-zip',
          renderChunk(code, chunk) {
            if (chunk.name === 'adm-zip')
              return transformSync(code, {
                minify: true,
                target: 'esnext'
                // drop: esbuild.drop
              }).code
          }
        }
      ],
      build: {
        minify: isProd,
        externalizeDeps: {
          exclude: isProd ? ['adm-zip'] : []
        },
        rollupOptions: {
          // input: {
          //   index: resolve(__dirname, 'electron/main.ts')
          // }
          output: {
            // format: 'es'
            manualChunks(id) {
              if (id.includes('/node_modules/adm-zip/')) return 'adm-zip'
            }
          }
        }
        // outDir: 'dist/main'
      },
      esbuild
    },
    preload: {
      // plugins: [],
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
    renderer: viteConfig({ command, mode, isSsrBuild, isPreview })
  }
})
