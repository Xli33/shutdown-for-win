<template>
  <q-bar v-if="exist" class="titlebar" :style="{ 'app-region': appRegion }">
    <q-icon :name="icon" />
    <q-space />
    <!-- <div class="titlebar-window-action">
      <q-btn square flat icon="minimize" @click="minimize" />
      <q-btn v-if="hasMaximize" :disable="!maximizable" square flat :icon="isMaximized ? 'crop_16_9' : 'crop_square'"
        @click="toggleMaximize" />
      <q-btn square flat icon="close" class="titlebar-btn-close" @click="close" />
    </div> -->
  </q-bar>
</template>

<script lang="ts">
export default {
  name: 'Bar'
}
</script>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

defineProps({
  //   title: String,
  icon: {
    type: String,
    default: 'o_next_plan'
  },
  hasMaximize: {
    type: Boolean,
    default: true
  },
  maximizable: Boolean,
  // 默认情况下，应该仅在 electron 环境中才需要顶部的应用bar
  exist: {
    type: Boolean,
    default: !!window.electronAPI
  }
})

const appRegion = ref('drag')
// isMaximized = ref(false)

// const minimize = (e: Event) => {
//   const btn = e.currentTarget as HTMLElement
//   btn.style.pointerEvents = 'none';
//   btn.style.display = 'none'
//   // eslint-disable-next-line @typescript-eslint/no-unused-expressions
//   btn.offsetWidth
//   btn.style.display = ''
//   window.electronAPI.minimize()
//   // btn.classList.remove('q-hoverable')
//   // document.addEventListener('mousenter', () => {
//   //   btn.classList.add('q-hoverable')
//   // }, { once: true, capture: true })
//   setTimeout(() => {
//     btn.style.pointerEvents = '';
//   });
// }

// const maximize = () => {
//   window.electronAPI.maximize()
// }

// const toggleMaximize = () => {
//   window.electronAPI.toggleMaximize()
// }

// const close = () => {
//   window.close()
// }

onMounted(() => {
  // window.addEventListener('maximize', (e) => {
  //   isMaximized.value = true
  // })
  // window.addEventListener('unmaximize', () => {
  //   isMaximized.value = false
  // })
  // 任何会遮挡Bar的类modal出现后都应触发该事件，避免 app-region: drag 的元素始终响应原生拖拽，即便元素层级非顶层
  window.onModalChange = (hidden: boolean) => {
    appRegion.value = hidden ? 'drag' : 'none'
  }
})
</script>

<style lang="less">
.titlebar {
  padding-right: 0;
  user-select: none;

  &- {
    &window-action {
      height: 100%;
      app-region: no-drag;

      > .q-btn {
        height: 100%;
        padding: 0 1em;
        vertical-align: top;
      }
    }

    button&btn-close.q-btn:hover > .q-focus-helper {
      background-color: red;
      opacity: 1;
    }
  }
}
</style>
