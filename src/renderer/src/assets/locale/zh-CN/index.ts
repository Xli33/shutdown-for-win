import msgs from 'quasar/lang/zh-CN'

const modules = import.meta.glob('./*.js', { eager: true, import: 'default' })
const map: Obj = {
  quasar: msgs,
  app: {}
}

Object.entries(modules).forEach((e) => {
  map.app[e[0].slice(2, -3)] = e[1]
})

export default map
