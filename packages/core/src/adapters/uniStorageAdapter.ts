import type { StorageAdapter, TourState, TourId } from '../types'

const KEY = (id: TourId) => `ugt:${id}`

export function createUniStorageAdapter(): StorageAdapter {
  return {
    async get(id) {
      const raw = uni.getStorageSync(KEY(id))
      return (raw && typeof raw === 'object') ? (raw as TourState) : null
    },
    async set(id, state) { uni.setStorageSync(KEY(id), state) },
    async clear(id) { uni.removeStorageSync(KEY(id)) },
  }
}
