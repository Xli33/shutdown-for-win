import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import externals from '@yellowspot/vite-plugin-externals'
import html from 'vite-plugin-htmlx'
// import electron from 'vite-plugin-electron'

// https://vite.dev/config/
export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
  console.log(command, mode, isSsrBuild, isPreview)

  const isBuild = command === 'build'

  return {
    plugins: [
      vue(),
      vueJsx(),
      vueDevTools(),
      mode !== 'test' &&
        externals({
          vue: 'Vue',
          'vue-router': 'VueRouter',
          quasar: 'Quasar'
        }),
      // splitVendorChunkPlugin(),
      html({
        minify: isBuild && {
          removeComments: true, // 删除注释
          collapseWhitespace: true, // 压缩空白符
          minifyJS: true,
          minifyCSS: true
        },
        page: {
          /**
           * Once you write the entry here, you will not need to add a script tag inside `index.html`,
           * and the original tag needs to be deleted.
           */
          // entry: 'src/main.ts',
          /**
           * If you want to store the `index.html` file in a specified folder,
           * you can modify it, otherwise no configuration is needed
           * @default index.html
           */
          // template: 'src/renderer/index.html',
          /**
           * Data to inject into the EJS template
           */
          inject: {
            data: {
              // vconsoleScript: isDev
              //   ? '<script src="https://cdn.staticfile.org/vConsole/3.4.1/vconsole.min.js"></script>'
              //   : '',
              // vconsoleRun: isDev ? '<script>_HASHQUERY.vconsole && new VConsole();</script>' : '',
              // formalConfig: isProd
              //   ? `<script>config-origin/config_formal.js?${Date.now()}</script>`
              //   : ''
            }
          }
        }
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src/renderer/src', import.meta.url))
      }
    },
    build: {
      // target: 'esnext',
      minify: isBuild,
      // modulePreload: {
      //   polyfill: false
      // },
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor'
            }
          }
        }
      }
    },
    esbuild: {
      drop: isBuild ? ['console', 'debugger'] : [] // 删除所有的console 和 debugger
      // include: ['ts', 'jsx', 'tsx', 'js'],
      // exclude: []
      // target: 'esnext'
    },
    optimizeDeps: {
      esbuildOptions: {
        target: 'esnext'
      }
    }
  }
})
