import type { RouteRecordRaw } from 'vue-router'

const route: RouteRecordRaw[] = [
  {
    path: '/:notFound(.*)*',
    name: 'error404',
    meta: {
      title: '404-页面不存在'
    },
    component: () => import('../views/error404.vue')
  }
]

export default route
