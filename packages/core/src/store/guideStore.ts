import { defineStore } from 'pinia'
import type { StorageAdapter, TourId, TourState, TourStatus } from '../types'

interface AttachOpts { onStorageError?: (err: Error) => void }

export const useGuideStore = defineStore('uni-guide-tour', {
  state: () => ({
    activeTour: null as TourId | null,
    currentStepIndex: 0,
    status: 'idle' as TourStatus,
    completedTours: {} as Record<TourId, { completedAt: number }>,
    _storage: null as StorageAdapter | null,
    _onStorageError: null as ((e: Error) => void) | null,
    _startedAt: 0,
  }),
  actions: {
    attachStorage(s: StorageAdapter, opts: AttachOpts = {}) {
      this._storage = s
      this._onStorageError = opts.onStorageError ?? null
    },
    async hydrate(tourIds: TourId[]) {
      if (!this._storage) return
      for (const id of tourIds) {
        try {
          const s = await this._storage.get(id)
          if (s?.status === 'completed' && s.completedAt) {
            this.completedTours[id] = { completedAt: s.completedAt }
          } else if (s && (s.status === 'running' || s.status === 'paused' || s.status === 'awaiting-route')) {
            this.activeTour = id
            this.status = s.status
            this.currentStepIndex = s.currentStepIndex
            this._startedAt = s.startedAt
          }
        } catch (e) { this._onStorageError?.(e as Error) }
      }
    },
    async startTour(id: TourId) {
      this.activeTour = id
      this.currentStepIndex = 0
      this.status = 'running'
      this._startedAt = Date.now()
      await this._persist()
    },
    async advance() {
      this.currentStepIndex += 1
      await this._persist()
    },
    async retreat() {
      this.currentStepIndex = Math.max(0, this.currentStepIndex - 1)
      await this._persist()
    },
    async pause() { this.status = 'paused'; await this._persist() },
    async resume() { this.status = 'running'; await this._persist() },
    async awaitRoute() { this.status = 'awaiting-route'; await this._persist() },
    async completeTour() {
      this.status = 'completed'
      const completedAt = Date.now()
      if (this.activeTour) this.completedTours[this.activeTour] = { completedAt }
      await this._persist(completedAt)
    },
    async stopTour() {
      this.status = 'idle'
      this.activeTour = null
      this.currentStepIndex = 0
    },
    async clearTour(id: TourId) {
      try { await this._storage?.clear(id) }
      catch (e) { this._onStorageError?.(e as Error) }
      delete this.completedTours[id]
    },
    async _persist(completedAt?: number) {
      if (!this._storage || !this.activeTour) return
      const state: TourState = {
        status: this.status,
        currentStepIndex: this.currentStepIndex,
        startedAt: this._startedAt,
        ...(completedAt ? { completedAt } : {}),
      }
      try { await this._storage.set(this.activeTour, state) }
      catch (e) { this._onStorageError?.(e as Error) }
    },
  },
})
