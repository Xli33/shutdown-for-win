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
      <q-scroll-area style="height: calc(100% - 104px)">
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
      <div class="q-pa-xs text-center">
        <a
          href="https://github.com/Xli33/shutdown-for-win#readme"
          class="relative-position q-mr-xs"
          open-external
          >关于</a
        >
        <q-badge outline color="primary">v{{ ver }}</q-badge>
        <q-btn flat dense padding="0 xs" :loading="checking" class="q-ml-md" @click="checkUpdate"
          >检查更新
          <template #loading>
            <q-spinner size="xs"></q-spinner>
          </template>
        </q-btn>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { getCurrentInstance, onMounted, ref, watch } from 'vue'
import { Dark } from 'quasar'
import { globalEmitter, useUserStore } from './store'
import { useLangStore } from './store'

const { notify } = getCurrentInstance()!.appContext.config.globalProperties
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

const leftDrawerOpen = ref(true),
  checking = ref(false)

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

const compareVerion = (left: string, right: string) => {
  const leftVer = left.split('.'),
    rightVer = right.split('.')
  const dis = rightVer.length - leftVer.length
  if (dis > 0) {
    leftVer.push(...'0'.repeat(dis))
  }
  console.log(leftVer.join('.'), rightVer.join('.'))
  for (let i = 0, len = leftVer.length; i < len; i++) {
    if (+leftVer[i] > +rightVer[i]) return 1
    if (+leftVer[i] < +rightVer[i]) return -1
  }
  // 进入到这表示版本号相同
  return 0
}

const checkUpdate = () => {
  checking.value = true
  fetch('https://raw.githubusercontent.com/Xli33/shutdown-for-win/refs/heads/main/package.json')
    .then(async (res) => {
      checking.value = false
      if (!res.ok) {
        notify({
          type: 'negative',
          message: res.status + ' ' + res.statusText
        })
        return
      }
      const json = await res.json()
      if (compareVerion(json.version, window.ver) <= 0) {
        notify({
          message: '当前已是最新版本'
        })
        return
      }
      const updateInfo = notify({
        group: false,
        type: 'info',
        timeout: 0,
        message: '当前有新版本：' + json.version,
        actions: [
          {
            label: '更新',
            color: 'white',
            noDismiss: true,
            handler: () => {
              updateInfo(
                {
                  spinner: true,
                  message: 'updating...',
                  caption: 0 + '%',
                  actions: []
                },
                false
              )
              fetch(
                // `https://github.com/Xli33/shutdown-for-win/releases/download/v${json.version}/ShutdownForWin-${json.version}-win.7z`
                `https://github.com/Xli33/shutdown-for-win/releases/download/v${json.version}/app.zip`
              )
                .then(async (res) => {
                  if (res.ok) {
                    // 通过 content-length 得到总量
                    const total = +res.headers.get('content-length')!
                    const reader = res.clone().body!.getReader()
                    let loaded = 0
                    while (1) {
                      const { value, done } = await reader.read()
                      if (done) break
                      // 每一次读取都累加起来
                      loaded += value.length
                      updateInfo({
                        message: 'downloading...',
                        caption: Math.floor((loaded / total) * 100) + '%'
                      })
                    }
                    updateInfo({
                      message: 'installing...'
                    })
                    window.electronAPI
                      .updatePkg(
                        await res.arrayBuffer()
                        // new File(
                        //   [await res.arrayBuffer()],
                        //   res.headers.get('content-disposition')!.match('filename=(.+)')?.[1] ||
                        //     'update.zip',
                        //   {
                        //     type: 'application/zip'
                        //   }
                        // )
                      )
                      .then(() => {
                        updateInfo(
                          {
                            type: 'positive',
                            spinner: false,
                            message: '更新成功，重启后生效',
                            caption: '',
                            actions: [
                              {
                                label: '重启界面',
                                color: '#fff',
                                handler() {
                                  location.reload()
                                }
                              },
                              {
                                label: '重启应用',
                                color: '#fff',
                                handler() {
                                  window.electronAPI.restart()
                                }
                              }
                            ]
                          },
                          true
                        )
                      })
                      .catch((err) => {
                        notify({
                          type: 'warning',
                          message: err
                        })
                      })
                  }
                })
                .catch((err) => {
                  updateInfo()
                  notify({
                    type: 'negative',
                    message: err
                  })
                })
            }
          }
        ]
      })
    })
    .catch((err) => {
      checking.value = false
      notify({
        type: 'negative',
        message: err,
        caption: '可能需要系统代理进行访问'
      })
    })
}

watch(
  () => Dark.isActive,
  (val) => {
    document.documentElement.classList[val ? 'add' : 'remove']('dark')
  }
)

onMounted(() => {
  document.onclick = (e) => {
    const el = e.target as HTMLAnchorElement
    if (el.hasAttribute('open-external')) {
      e.preventDefault()
      window.electronAPI.open(el.href)
    }
  }
})
</script>
