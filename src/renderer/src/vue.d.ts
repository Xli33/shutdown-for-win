import type { QNotifyAction, QNotifyCreateOptions, QNotifyUpdateOptions } from 'quasar'

declare module 'vue' {
  interface ComponentCustomProperties {
    ver: string
    notify: (
      opts: QNotifyCreateOptions,
      closeBtn?: QNotifyAction | boolean
    ) => (opts?: QNotifyUpdateOptions, closeBtn?: QNotifyAction | boolean) => void
  }
}
