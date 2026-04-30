import { describe, it, expect } from 'vitest'
import { computeTipPosition } from '../../src/components/computeTipPosition'

const screen = { width: 375, height: 812, statusBarHeight: 20, safeBottom: 34 }
const tipSize = { width: 280, height: 120 }

describe('computeTipPosition', () => {
  it('places tip below hole when placement=bottom and space ok', () => {
    const hole = { top: 100, left: 50, width: 200, height: 80 }
    const r = computeTipPosition(hole, tipSize, 'bottom', screen)
    expect(r.top).toBe(100 + 80 + 12)
    expect(r.left).toBeGreaterThanOrEqual(8)
  })

  it('places tip above hole when placement=top', () => {
    const hole = { top: 400, left: 50, width: 200, height: 80 }
    const r = computeTipPosition(hole, tipSize, 'top', screen)
    expect(r.top).toBe(400 - 12 - tipSize.height)
  })

  it('auto: prefers bottom if fits', () => {
    const hole = { top: 100, left: 50, width: 200, height: 80 }
    const r = computeTipPosition(hole, tipSize, 'auto', screen)
    expect(r.top).toBe(100 + 80 + 12)
  })

  it('auto: falls back to top when no bottom space', () => {
    const hole = { top: 700, left: 50, width: 200, height: 60 }
    const r = computeTipPosition(hole, tipSize, 'auto', screen)
    expect(r.top).toBe(700 - 12 - tipSize.height)
  })

  it('clamps tip inside safe area top', () => {
    const hole = { top: 0, left: 50, width: 200, height: 30 }
    const r = computeTipPosition(hole, tipSize, 'top', screen)
    expect(r.top).toBeGreaterThanOrEqual(screen.statusBarHeight + 8)
  })

  it('clamps tip inside safe area bottom', () => {
    const hole = { top: 500, left: 50, width: 200, height: 80 }
    const r = computeTipPosition(hole, tipSize, 'bottom', screen)
    const maxTop = screen.height - screen.safeBottom - tipSize.height - 8
    expect(r.top).toBeLessThanOrEqual(maxTop)
  })
})
