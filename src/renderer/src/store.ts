import { defineStore } from 'pinia'
import { Lang, LoadingBar, Notify, type QuasarLanguage } from 'quasar'
import { Emitter, StoreSimply } from 'utils-where'
import i18n, { availableLocales, type availLangs } from './i18n'

type GlobalConfig = {
  // 对应 Quasar.Dark.set 的参数类型，false 表示 日间模式，true 为夜间模式
  theme: 'auto' | boolean
  lang: availLangs
  plans: { type: 0 | 1; h: number; m: number; s: number }[]
  shutAt: number | string
}

const Setting = new StoreSimply<GlobalConfig>(null, {
  theme: 'auto',
  lang: 'zh-CN',
  plans: [], // 定时计划
  shutAt: '' // 已设置的关机时间
})

// 用户信息及相关设置
export const useUserStore = defineStore('user', {
  state: () => ({
    custom: Setting.data // 持久化存储
  }),
  actions: {
    // 更改用户设置
    changeSetting<T extends keyof GlobalConfig>(key: T, val: GlobalConfig[T]) {
      this.custom[key] = val
      Setting.setVal(key, val)
    }
  }
})

// 语言切换
export const useLangStore = defineStore('locale', {
  getters: {
    locale() {
      const { custom } = useUserStore()
      return custom.lang
    }
  },
  actions: {
    // getCustom(keyPath: string) {
    //   return Language.getVal(keyPath, this.custom)
    // },
    // setCustom(keyPath: string | Obj, value?: any) {
    //   if (Language.data !== this.custom) {
    //     Language.data = this.custom
    //   }
    //   // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    //   typeof keyPath === 'string'
    //     ? Language.setVal(keyPath, value, { useJSON: true })
    //     : Language.save(keyPath, null, true)
    //   console.log(Language)
    //   return this
    // },
    // 支持国际化时开启
    changeLocale(lang: availLangs, quasarMsg: QuasarLanguage) {
      const User = useUserStore()
      // Quasar因为默认显示en-US，故不重复引入其en-US语言，当参数为 undefined 时，Quasar.Lang 会设置成 en-US
      Lang.set(lang !== 'en-US' ? quasarMsg : (undefined as unknown as QuasarLanguage))
      User.custom.lang = lang
      i18n.global.locale.value = lang
      document.documentElement.lang = lang
      User.changeSetting('lang', lang)
    },
    // 获取语言（支持国际化时开启）
    async loadLocale(lang: availLangs) {
      const res = await import(`./assets/locale/${lang}/index.ts`).catch((err) => {
        Notify.create({
          type: 'warning',
          caption: 'failed to fetch the locale: ' + lang,
          message: err
        })
        return false
      })
      console.log(res)
      return res.default as {
        quasar: QuasarLanguage
        app: Obj
      } | void
    },
    // 设置有效语言（支持国际化时开启）
    async setLocale(lang: availLangs) {
      // 若传入语言就是当前在使用的语言，则直接跳过切换步骤
      if (i18n.global.locale.value === lang) return
      if (!lang || !availableLocales.includes(lang)) {
        this.changeLocale('zh-CN', i18n.global.messages.value['zh-CN'].quasar)
        return
      }
      if (i18n.global.messages.value[lang].app) {
        this.changeLocale(lang, i18n.global.messages.value[lang].quasar)
        return
      }
      LoadingBar.start()
      const msgs = await this.loadLocale(lang)
      if (msgs) {
        i18n.global.setLocaleMessage(lang, msgs)
        this.changeLocale(lang, msgs.quasar)
      }
      LoadingBar.stop()
    }
  }
})

export const globalEmitter = Emitter<{
  setShutTime: [(item: GlobalConfig['plans'][number]) => void]
}>()
