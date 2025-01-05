import { createI18n } from 'vue-i18n'
import translation from './assets/locale/zh-CN'
// import router from './router'
// import { Notify } from 'quasar'

console.log(translation)

export const availableLocales = ['zh-CN', 'en-US'] as const

export type availLangs = (typeof availableLocales)[number]

// export const quasarZhCn = translation.quasar

export default createI18n({
  allowComposition: true,
  // globalInjection: true,
  legacy: false,
  locale: 'zh-CN',
  fallbackLocale: 'zh-CN',
  // availableLocales,
  messages: {
    'zh-CN': translation,
    'en-US': {} as Obj
  }
})
