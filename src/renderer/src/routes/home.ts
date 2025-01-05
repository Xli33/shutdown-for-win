import type { RouteRecordRaw } from 'vue-router'

const route: RouteRecordRaw = {
  path: '/home',
  name: 'home',
  meta: {
    //   tab: true
  },
  component: () => import('../views/Home.vue')
}

export default route
