import './assets/base.less'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Quasar, { Notify, type QuasarLanguage } from 'quasar'

import router from './router'
import i18n from './i18n'
import App from './App.vue'
import components from '@/components'

const app = createApp(App)
  .use(createPinia())
  .use(router)
  .use(i18n)
  .use(Quasar, {
    config: {
      dark: 'auto'
    }
  })

// Quasar默认显示en-US，手动设置成zh-CN
Quasar.lang.set(i18n.global.messages.value['zh-CN'].quasar as QuasarLanguage)
Notify.setDefaults({
  position: 'top',
  actions: [{ icon: 'close' }]
})

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
app.config.globalProperties.$t = (keyPath) => i18n.global.t('app.' + keyPath)

components.forEach((e) => {
  app.component(e.name as string, e)
})

app.mount('#app')
