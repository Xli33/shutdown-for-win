<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <Bar></Bar>
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="leftDrawerOpen = !leftDrawerOpen" />
        <q-toolbar-title>
          <!-- <q-avatar>
        <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
      </q-avatar> -->
          {{ $t('Home.标题') }}
        </q-toolbar-title>
        <!-- {{ Language.custom.APP.ui.lang }} -->
        <Lang class="q-mr-md"></Lang>
        <ThemeMenu></ThemeMenu>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" @show="drawerShown" @hide="drawerHidden">
      <div class="q-pa-md" style="font-size: 1.8em">
        <!-- <q-icon name="bookmark"></q-icon> -->
        <span class="vertical-middle">{{ $t('Home.配置') }}</span>
      </div>
      <!-- drawer content -->
      <q-scroll-area style="height: calc(100% - 72px)">
        <q-list class="q-pb-md">
          <q-item v-for="(item, index) in User.custom.plans" :key="index" v-ripple clickable>
            <q-item-section>
              <q-item-label>
                <template v-if="item.type == 0"
                  >{{ item.h.toString().padStart(2, '0') }}:{{
                    item.m.toString().padStart(2, '0')
                  }}:{{ item.s.toString().padStart(2, '0') }}</template
                >
                <template v-else>
                  <span v-if="item.h > 0" class="q-mr-xs">{{ item.h }}{{ $t('Home.简时') }}</span>
                  <span v-if="item.m > 0" class="q-mr-xs">{{ item.m }}{{ $t('Home.简分') }} </span>
                  <span v-if="item.s > 0">{{ item.s }}{{ $t('Home.简秒') }}</span>
                </template>
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <div class="q-gutter-xs">
                <q-btn flat dense round :ripple="false" icon="done" @click="usePlan(item)"></q-btn>
                <q-btn flat dense round :ripple="false" icon="delete">
                  <q-popup-proxy>
                    <q-btn v-close-popup flat :ripple="false" @click="delPlan(index)">{{
                      $t('common.确定')
                    }}</q-btn>
                    <q-btn v-close-popup flat :ripple="false">{{ $t('common.取消') }}</q-btn>
                  </q-popup-proxy>
                </q-btn>
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Dark } from 'quasar'
import { globalEmitter, useUserStore } from './store'
import { useLangStore } from './store'

const User = useUserStore()
const Language = useLangStore()

// 设置语言
let settedLang = 'zh-CN'
if (Language.locale !== settedLang) {
  Language.setLocale(Language.locale).then(() => {
    settedLang = Language.locale
  })
}
// 设置主题模式
Dark.set(User.custom.theme)

const leftDrawerOpen = ref(true)

// methods

// drawer显示或隐藏触发全局modalChange事件，通知Bar组件更改其app-region
const drawerShown = () => {
  window.onModalChange(false)
}
const drawerHidden = () => {
  window.onModalChange(true)
}

// 删除计划配置
const delPlan = (index: number) => {
  const { plans } = User.custom
  plans.splice(index, 1)
  User.changeSetting('plans', plans)
}

// 使用配置
const usePlan = (item: (typeof User.custom.plans)[number]) => {
  leftDrawerOpen.value = false
  globalEmitter.emit('setShutTime', item)
}
</script>
