import type { StorageAdapter, TourId, TourState } from 'uni-guide-tour'

export interface ApiStorageOptions {
  baseURL: string
  headers?: Record<string, string>
  fetch?: typeof fetch
}

export function createApiStorage(opts: ApiStorageOptions): StorageAdapter {
  const f = opts.fetch ?? globalThis.fetch
  const url = (id: TourId) => `${opts.baseURL.replace(/\/$/, '')}/${encodeURIComponent(id)}`
  const headers = { 'content-type': 'application/json', ...(opts.headers ?? {}) }

  return {
    async get(id) {
      const res = await f(url(id), { method: 'GET', headers })
      if (res.status === 404) return null
      if (!res.ok) throw new Error(`storage-api GET failed: ${res.status}`)
      return await res.json() as TourState
    },
    async set(id, state) {
      const res = await f(url(id), { method: 'PUT', headers, body: JSON.stringify(state) })
      if (!res.ok) throw new Error(`storage-api PUT failed: ${res.status}`)
    },
    async clear(id) {
      const res = await f(url(id), { method: 'DELETE', headers })
      if (!res.ok && res.status !== 404) throw new Error(`storage-api DELETE failed: ${res.status}`)
    },
  }
}
