import { useSyncExternalStore } from 'react'
import { getData, subscribe } from './store'
import type { AppData } from './types'

export function useStore(): AppData {
  return useSyncExternalStore(subscribe, getData, getData)
}
