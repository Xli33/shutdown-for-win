import type { ComponentOptions } from 'vue'

const modules = import.meta.glob(['./*.vue'], { eager: true, import: 'default' })
console.log(modules)

const arr = <ComponentOptions[]>Object.values(modules)
// console.log(arr)

export default arr
