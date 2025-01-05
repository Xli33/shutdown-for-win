<template>
  <q-input v-model.trim.lazy="date" outlined>
    <template #prepend>
      <q-icon name="event" class="cursor-pointer q-mr-sm">
        <q-popup-proxy transition-show="scale" transition-hide="scale">
          <q-date v-model="date" :mask="mask" :options="options">
            <div class="text-right">
              <q-btn v-close-popup color="primary" flat>{{ $t('common.关闭') }}</q-btn>
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
      <q-icon name="access_time" class="cursor-pointer">
        <q-popup-proxy transition-show="scale" transition-hide="scale">
          <q-time v-model="date" :mask="mask" format24h :with-seconds="withSeconds">
            <div class="text-right">
              <q-btn v-close-popup color="primary" flat>{{ $t('common.关闭') }}</q-btn>
            </div>
          </q-time>
        </q-popup-proxy>
      </q-icon>
    </template>

    <template #append> </template>
  </q-input>
</template>

<script lang="ts">
export default {
  name: 'DateTime'
}
</script>

<script setup lang="ts">
import type { PropType } from 'vue'

defineProps({
  mask: {
    type: String,
    default: 'YYYY-MM-DD HH:mm:ss'
  },
  options: Function as PropType<() => boolean>,
  withSeconds: {
    type: Boolean,
    default: true
  }
})

const date = defineModel({ type: String })
</script>
