import { describe, it, expect, vi, beforeEach } from 'vitest'
import { driveTransition } from '../../src/engine/TransitionDriver'

const baseStep = { id: 's2', page: '/pages/next', target: 't2', title: '', content: '', button: '' }

describe('driveTransition', () => {
  let navigateSpy: any
  beforeEach(() => { navigateSpy = vi.fn(async () => undefined) })

  it('auto: same page → no navigate', async () => {
    const r = await driveTransition({
      step: baseStep, currentPage: '/pages/next',
      navigate: navigateSpy, waitForRoute: vi.fn(),
    })
    expect(navigateSpy).not.toHaveBeenCalled()
    expect(r.kind).toBe('immediate')
  })

  it('auto: different page → navigate', async () => {
    const r = await driveTransition({
      step: baseStep, currentPage: '/pages/prev',
      navigate: navigateSpy, waitForRoute: vi.fn(),
    })
    expect(navigateSpy).toHaveBeenCalledWith('/pages/next')
    expect(r.kind).toBe('navigated')
  })

  it('wait-for-route: never navigates, returns awaiting', async () => {
    const r = await driveTransition({
      step: { ...baseStep, transition: 'wait-for-route' },
      currentPage: '/pages/prev',
      navigate: navigateSpy, waitForRoute: vi.fn(),
    })
    expect(navigateSpy).not.toHaveBeenCalled()
    expect(r.kind).toBe('awaiting')
  })

  it('tap-target: simulates tap then awaits route', async () => {
    const tapSpy = vi.fn()
    const r = await driveTransition({
      step: { ...baseStep, transition: 'tap-target' },
      currentPage: '/pages/prev',
      navigate: navigateSpy, waitForRoute: vi.fn(), tapTarget: tapSpy,
    })
    expect(tapSpy).toHaveBeenCalled()
    expect(r.kind).toBe('awaiting')
  })
})
