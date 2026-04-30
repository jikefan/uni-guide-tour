import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createUniStorageAdapter } from '../../src/adapters/uniStorageAdapter'

describe('uniStorageAdapter', () => {
  beforeEach(() => {
    const m = new Map<string, any>()
    ;(globalThis as any).uni.setStorageSync = vi.fn((k, v) => m.set(k, v))
    ;(globalThis as any).uni.getStorageSync = vi.fn((k) => m.get(k) ?? '')
    ;(globalThis as any).uni.removeStorageSync = vi.fn((k) => m.delete(k))
  })

  it('round-trips state', async () => {
    const a = createUniStorageAdapter()
    await a.set('t1', { status: 'running', currentStepIndex: 2, startedAt: 100 })
    const r = await a.get('t1')
    expect(r?.currentStepIndex).toBe(2)
  })

  it('returns null for missing key', async () => {
    const a = createUniStorageAdapter()
    expect(await a.get('absent')).toBeNull()
  })

  it('clear removes value', async () => {
    const a = createUniStorageAdapter()
    await a.set('t1', { status: 'running', currentStepIndex: 0, startedAt: 1 })
    await a.clear('t1')
    expect(await a.get('t1')).toBeNull()
  })
})
