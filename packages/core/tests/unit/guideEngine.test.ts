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

  it('relocate updates currentRect when running, swallows locate errors', async () => {
    const store = useGuideStore()
    store.attachStorage(memStorage())
    let calls = 0
    const e = new GuideEngine({
      store,
      locate: async () => {
        calls++
        if (calls === 1) return { top: 10, left: 10, width: 100, height: 50 }
        throw new Error('boom')
      },
      navigate: vi.fn(async () => undefined),
      waitForRoute: vi.fn(async () => undefined),
      getCurrentPage: () => '/p1',
    })
    await e.start(tour)
    expect(e.currentRect.value).toEqual({ top: 10, left: 10, width: 100, height: 50 })
    // Next locate call throws; relocate should swallow it and leave engine consistent
    await e.relocate()
    expect(e.store.status).toBe('running')
  })

  it('relocate is a no-op when not running', async () => {
    const e = makeEngine()
    // Without start, status is 'idle' → relocate exits early
    await e.relocate()
    expect(e.currentRect.value).toBeNull()
  })

  it('stop clears currentTour and currentRect, resets store to idle', async () => {
    const e = makeEngine()
    await e.start(tour)
    await e.stop()
    expect(e.currentTour.value).toBeNull()
    expect(e.currentRect.value).toBeNull()
    expect(e.store.status).toBe('idle')
  })
})
