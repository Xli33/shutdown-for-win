import { type RouteRecordRaw } from 'vue-router'
import error from './error'

const modules = import.meta.glob(['./*.ts', '!./index.ts', '!./error.ts'], {
  eager: true,
  import: 'default'
})
const menus = <RouteRecordRaw[]>Object.values(modules)

console.log(modules)

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  ...menus,
  ...error
]

export default routes
