<template>
  <q-btn flat round dense icon="translate">
    <q-menu auto-close>
      <q-list>
        <q-item
          clickable
          :active="'zh-CN' === Language.locale"
          class="items-center"
          @click="changeLang('zh-CN')"
        >
          <span class="vertical-middle">简体中文</span>
        </q-item>
        <q-item
          clickable
          :active="'en-US' === Language.locale"
          class="items-center"
          @click="changeLang('en-US')"
        >
          <span class="vertical-middle">English</span>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script lang="ts">
import type { availLangs } from '@/i18n'
import { useLangStore } from '@/store'

// 声明组件 name 不建议用 definOptions，因为 setup 内部有内容时，哪怕只有一行注释，依旧会导致无名组件被赋予 __name 属性
// 这时若用 defineOptions 声明了 name，组件就会有一个多余的 __name
// 当这里声明过 name 后，即便有调用 setup 也不会再生成多余的 __name
export default {
  name: 'Lang'
}
</script>

<script setup lang="ts">
const Language = useLangStore()

function changeLang(lang: availLangs) {
  Language.setLocale(lang)
}
</script>
