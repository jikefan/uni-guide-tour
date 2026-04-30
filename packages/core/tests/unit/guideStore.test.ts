import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGuideStore } from '../../src/store/guideStore'
import type { StorageAdapter, TourState } from '../../src/types'

function memStorage(): StorageAdapter {
  const m = new Map<string, TourState>()
  return {
    get: vi.fn(async id => m.get(id) ?? null),
    set: vi.fn(async (id, s) => { m.set(id, s) }),
    clear: vi.fn(async id => { m.delete(id) }),
  }
}

describe('guideStore', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('startTour sets state then persists', async () => {
    const storage = memStorage()
    const s = useGuideStore()
    s.attachStorage(storage)
    await s.startTour('demo')
    expect(s.activeTour).toBe('demo')
    expect(s.status).toBe('running')
    expect(s.currentStepIndex).toBe(0)
    expect(storage.set).toHaveBeenCalledWith('demo', expect.objectContaining({ status: 'running' }))
  })

  it('hydrate populates completedTours from storage', async () => {
    const storage = memStorage()
    await storage.set('done-tour', {
      status: 'completed', currentStepIndex: 5, startedAt: 1, completedAt: 2,
    })
    const s = useGuideStore()
    s.attachStorage(storage)
    await s.hydrate(['done-tour', 'unknown-tour'])
    expect(s.completedTours['done-tour']).toEqual({ completedAt: 2 })
    expect(s.completedTours['unknown-tour']).toBeUndefined()
  })

  it('does not block UI when storage.set fails', async () => {
    const storage = memStorage()
    storage.set = vi.fn(async () => { throw new Error('disk full') })
    const errSpy = vi.fn()
    const s = useGuideStore()
    s.attachStorage(storage, { onStorageError: errSpy })
    await s.startTour('demo')
    expect(s.status).toBe('running')
    expect(errSpy).toHaveBeenCalled()
  })

  it('advance updates index and persists', async () => {
    const storage = memStorage()
    const s = useGuideStore()
    s.attachStorage(storage)
    await s.startTour('demo')
    await s.advance()
    expect(s.currentStepIndex).toBe(1)
    expect(storage.set).toHaveBeenLastCalledWith('demo',
      expect.objectContaining({ currentStepIndex: 1 }))
  })

  it('completeTour transitions to completed', async () => {
    const storage = memStorage()
    const s = useGuideStore()
    s.attachStorage(storage)
    await s.startTour('demo')
    await s.completeTour()
    expect(s.status).toBe('completed')
    expect(s.completedTours['demo']?.completedAt).toBeGreaterThan(0)
  })
})
