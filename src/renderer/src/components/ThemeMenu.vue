<template>
  <q-btn flat round dense icon="settings_brightness">
    <q-menu auto-close>
      <q-list>
        <q-item
          clickable
          :active="custom.theme === 'auto'"
          class="items-center"
          @click="changeTheme('auto')"
        >
          <q-icon name="brightness_medium" class="q-mr-xs"></q-icon>
          <span class="vertical-middle">自动</span>
        </q-item>
        <q-item
          clickable
          :active="custom.theme === false"
          class="items-center"
          @click="changeTheme(false)"
        >
          <q-icon name="light_mode" class="q-mr-xs"></q-icon>
          <span class="vertical-middle">日间</span>
        </q-item>
        <q-item
          clickable
          :active="custom.theme === true"
          class="items-center"
          @click="changeTheme(true)"
        >
          <q-icon name="dark_mode" class="q-mr-xs"></q-icon>
          <span class="vertical-middle">夜间</span>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script lang="ts">
// 声明组件 name 不建议用 definOptions，因为 setup 内部有内容时，哪怕只有一行注释，依旧会导致无名组件被赋予 __name 属性
// 这时若用 defineOptions 声明了 name，组件就会有一个多余的 __name
// 当这里声明过 name 后，即便有调用 setup 也不会再生成多余的 __name
export default {
  name: 'ThemeMenu'
}
</script>

<script setup lang="ts">
import { Dark } from 'quasar'
import { useUserStore } from '@/store'

const { custom, changeSetting } = useUserStore()

const changeTheme = (type: boolean | 'auto') => {
  Dark.set(type)
  changeSetting('theme', type)
}
</script>
