import { describe, it, expect, vi, beforeEach } from 'vitest'
import { locateTarget } from '../../src/platform/locate'
import { GuideTargetNotFoundError } from '../../src/errors'

function mockQuery(rectsPerCall: any[]) {
  let i = 0
  ;(globalThis as any).uni.createSelectorQuery = vi.fn(() => ({
    in: function () { return this },
    select: function () { return this },
    boundingClientRect: function (cb: any) {
      const r = rectsPerCall[Math.min(i, rectsPerCall.length - 1)]
      i++; setTimeout(() => cb(r), 0)
      return this
    },
    exec: function () { return this },
  }))
}

describe('locateTarget', () => {
  beforeEach(() => vi.clearAllMocks())

  it('resolves rect on first try', async () => {
    mockQuery([{ top: 10, left: 10, width: 100, height: 50 }])
    const r = await locateTarget('foo', { tourId: 't', stepId: 's' })
    expect(r.width).toBe(100)
  })

  it('retries until success', async () => {
    mockQuery([null, null, { top: 5, left: 5, width: 80, height: 40 }])
    const r = await locateTarget('foo', { tourId: 't', stepId: 's', retries: 5, intervalMs: 1 })
    expect(r.width).toBe(80)
  })

  it('throws GuideTargetNotFoundError when retries exhausted', async () => {
    mockQuery([null, null, null, null])
    await expect(locateTarget('foo', { tourId: 't', stepId: 's', retries: 3, intervalMs: 1 }))
      .rejects.toThrow(GuideTargetNotFoundError)
  })

  it('treats width=0 as not-found', async () => {
    mockQuery([{ top: 0, left: 0, width: 0, height: 0 }, { top: 0, left: 0, width: 100, height: 50 }])
    const r = await locateTarget('foo', { tourId: 't', stepId: 's', retries: 3, intervalMs: 1 })
    expect(r.width).toBe(100)
  })
})
