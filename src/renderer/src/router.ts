import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './routes'
// import { useLangStore } from './stores/locale'
import { LoadingBar } from 'quasar'

const router = createRouter({
  history: createWebHashHistory(/* import.meta.env.BASE_URL */),
  routes
})

// 已设置的语言（支持国际化时开启）
// let settedLocale = 'zh-CN'

router.beforeEach((to, from, next) => {
  LoadingBar.start()

  // 设置语言（支持国际化时开启）
  // if (settedLocale !== to.query.lang) {
  //   await useLangStore().setLocale(<'zh-CN'>to.query.lang)
  //   settedLocale = <string>to.query.lang
  // }

  next()
  LoadingBar.stop()
})

export default router
