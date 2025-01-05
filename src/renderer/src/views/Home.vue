<template>
  <q-page padding>
    <div class="row q-gutter-sm">
      <div class="col-3">
        <q-select
          v-model="type"
          :options="types"
          :label="$t('Home.类型')"
          :option-label="getType"
          outlined
        >
        </q-select>
      </div>
      <!-- @update:model-value="changeType" -->
      <div v-if="type === types[0]" class="col">
        <DateTime v-model="shutAt" :options="getValidDate"></DateTime>
      </div>
      <template v-else>
        <div class="col">
          <q-input
            v-model.number="timer.hour"
            type="number"
            :min="0"
            outlined
            :label="$t('Home.时')"
          />
        </div>
        <div class="col">
          <q-input
            v-model.number="timer.minute"
            type="number"
            :min="0"
            outlined
            :label="$t('Home.分')"
          />
        </div>
        <div class="col">
          <q-input
            v-model.number="timer.second"
            type="number"
            :min="0"
            outlined
            :label="$t('Home.秒')"
          />
        </div>
      </template>
    </div>
    <q-banner rounded :class="['q-mt-md q-mb-xl', !$q.dark.isActive && 'bg-grey-3']">
      <template #avatar>
        <q-icon name="info" color="primary" />
      </template>
      <transition name="flip" mode="out-in">
        <div v-if="User.custom.shutAt">
          <p>
            <span class="colon">{{ $t('Home.预计提示') }}</span
            >{{ formatTime() }}
          </p>
          <p>{{ $t('Home.仅供参考') }}</p>
        </div>
        <div v-else>
          <p>{{ $t('Home.默认提示1') }}</p>
          <p>{{ $t('Home.默认提示2') }}</p>
        </div>
      </transition>
      <template #action>
        <q-btn flat :label="$t('common.保存')" :disable="shutTime <= 0" @click="save" />
        <q-btn
          flat
          :label="$t('Home.开始')"
          :loading="loading"
          :disable="shutTime <= 0"
          @click="start"
        />
        <q-btn flat :label="$t('common.取消')" @click="cancel" />
      </template>
    </q-banner>
    <transition name="flip" mode="out-in">
      <div v-if="User.custom.shutAt" class="text-center">
        <q-chip color="deep-orange" text-color="white" icon="alarm" size="xl">
          <span
            >{{ countDown.day }}{{ $t('Home.天') }} {{ countDown.hour }}{{ $t('Home.简时') }}
            {{ countDown.minute }}{{ $t('Home.简分') }} {{ countDown.second
            }}{{ $t('Home.简秒') }}</span
          >
        </q-chip>
      </div>
    </transition>
  </q-page>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { Notify, date } from 'quasar'
import { CountDown } from 'utils-where'
import { globalEmitter, useUserStore } from '@/store'

const { $t } = getCurrentInstance()!.appContext.config.globalProperties
const User = useUserStore()
if (+User.custom.shutAt <= Date.now()) {
  User.custom.shutAt = ''
}

const types = reactive([
    {
      label: 'common.日期',
      value: 'date'
    },
    {
      label: 'Home.时分秒',
      value: 'hms'
    }
  ]),
  type = ref(types[0])
const shutAt = ref(date.formatDate(User.custom.shutAt || new Date(), 'YYYY-MM-DD HH:mm:ss'))
const timer = reactive({
    hour: 0,
    minute: 0,
    second: 0
  }),
  loading = ref(false)

// computed

const typeIsDate = computed(() => type.value.value === 'date')
const shutTime = computed(() =>
  typeIsDate.value && shutAt.value
    ? Date.parse(shutAt.value)
    : timer.hour + timer.minute + timer.second
)
// 离关机时间所剩秒数
const getLeftTime = () =>
  typeIsDate.value
    ? date.getDateDiff(shutAt.value, Date.now(), 'seconds')
    : timer.hour * 3600 + timer.minute * 60 + timer.second

const countDown = reactive({
  day: 0,
  hour: 0,
  minute: 0,
  second: 0
})
const counter = new CountDown({ second: getLeftTime() }, false, ({ day, hour, minute, second }) => {
  countDown.day = day
  countDown.hour = hour
  countDown.minute = minute
  countDown.second = second
})
counter.onEnd = () => true

// methods

const getType = (option: (typeof types)[number]) => $t(option.label)

const getValidDate = (d: string) => new Date(d) >= date.startOfDate(Date.now(), 'day')

const formatTime = () => date.formatDate(User.custom.shutAt, 'YYYY-MM-DD HH:mm:ss')

const cancel = () => {
  window.electronAPI.setShutdown(-1).then((err) => {
    if (err) {
      Notify.create({
        type: 'warning',
        position: 'top',
        message: err.message
      })
      return
    }
    counter.stop(true)
    User.changeSetting('shutAt', '')
  })
}
const start = () => {
  const leftSeconds = getLeftTime()
  if (leftSeconds <= 0) {
    Notify.create({
      type: 'warning',
      message: '请设置有效定时'
    })
    return
  }
  loading.value = true
  window.electronAPI.setShutdown(leftSeconds).then((err) => {
    setTimeout(() => {
      loading.value = false
    }, 1000)
    if (err) {
      Notify.create({
        type: 'warning',
        position: 'top',
        message: err.message
      })
      return
    }
    counter.stop(true)
    counter.to = date.addToDate(Date.now(), { seconds: leftSeconds })
    counter.start(true)
    User.changeSetting('shutAt', counter.to.valueOf())
  })
}

const save = () => {
  let type, hour, minute, second
  if (typeIsDate.value) {
    const dateObj = date.extractDate(shutAt.value, 'YYYY-MM-DD HH:mm:ss')
    hour = dateObj.getHours()
    minute = dateObj.getMinutes()
    second = dateObj.getSeconds()
    type = 0 as const
  } else {
    type = 1 as const
    hour = timer.hour
    minute = timer.minute
    second = timer.second
  }
  const { plans } = User.custom
  if (plans.every((e) => e.type !== type || e.h !== hour || e.m !== minute || e.s !== second)) {
    plans.push({
      type,
      h: hour,
      m: minute,
      s: second
    })
    User.changeSetting('plans', plans)
  }
  Notify.create({
    type: 'positive',
    message: $t('Home.保存成功')
  })
}

onMounted(() => {
  globalEmitter.on('setShutTime', (item: (typeof User.custom.plans)[number]) => {
    type.value = types[item.type]
    if (item.type === 0) {
      let tmp = date.buildDate({
        hour: item.h,
        minute: item.m,
        second: item.s,
        millisecond: 0
      })
      if (Date.now() >= +tmp) {
        tmp = date.addToDate(tmp, {
          day: 1
        })
      }
      shutAt.value = date.formatDate(tmp, 'YYYY-MM-DD HH:mm:ss')
    } else {
      timer.hour = item.h
      timer.minute = item.m
      timer.second = item.s
    }
  })
})

onBeforeUnmount(() => {
  globalEmitter.off('setShutTime')
})
</script>
