import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGuideStore } from '../../src/store/guideStore'
import { GuideEngine } from '../../src/engine/GuideEngine'
import type { Tour } from '../../src/types'

const tour: Tour = {
  id: 'demo',
  steps: [
    { id: 's1', page: '/p1', target: 't1', title: '', content: '', button: '' },
    { id: 's2', page: '/p1', target: 't2', title: '', content: '', button: '' },
    { id: 's3', page: '/p2', target: 't3', title: '', content: '', button: '' },
  ],
}

function memStorage() {
  const m = new Map<string, any>()
  return {
    get: async (k: string) => m.get(k) ?? null,
    set: async (k: string, v: any) => { m.set(k, v) },
    clear: async (k: string) => { m.delete(k) },
  }
}

function makeEngine() {
  const store = useGuideStore()
  store.attachStorage(memStorage())
  return new GuideEngine({
    store,
    locate: async () => ({ top: 10, left: 10, width: 100, height: 50 }),
    navigate: vi.fn(async () => undefined),
    waitForRoute: vi.fn(async () => undefined),
    getCurrentPage: () => '/p1',
  })
}

describe('GuideEngine', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('start → first step running', async () => {
    const e = makeEngine()
    await e.start(tour)
    expect(e.store.status).toBe('running')
    expect(e.store.currentStepIndex).toBe(0)
  })

  it('next advances within same page', async () => {
    const e = makeEngine()
    await e.start(tour); await e.next()
    expect(e.store.currentStepIndex).toBe(1)
    expect(e.store.status).toBe('running')
  })

  it('next across pages calls navigate', async () => {
    const e = makeEngine()
    await e.start(tour)
    await e.next()
    await e.next()
    expect(e.deps.navigate).toHaveBeenCalledWith('/p2')
  })

  it('next at last step transitions to completed', async () => {
    const e = makeEngine()
    await e.start(tour)
    await e.next(); await e.next(); await e.next()
    expect(e.store.status).toBe('completed')
  })

  it('start when already completed and force=false → no-op', async () => {
    const e = makeEngine()
    await e.start(tour)
    await e.next(); await e.next(); await e.next()
    await e.start(tour)
    expect(e.store.currentStepIndex).toBe(2)
    expect(e.store.status).toBe('completed')
  })

  it('start force=true resets and reruns', async () => {
    const e = makeEngine()
    await e.start(tour)
    await e.next(); await e.next(); await e.next()
    await e.start(tour, { force: true })
    expect(e.store.currentStepIndex).toBe(0)
    expect(e.store.status).toBe('running')
  })
})
