import { describe, it, expect, vi, beforeEach } from 'vitest'
import { navigateToPage, isTabBarPage } from '../../src/platform/route'
import { GuideRouteFailedError } from '../../src/errors'

describe('isTabBarPage', () => {
  it('matches absolute path against tabBar list', () => {
    expect(isTabBarPage('/pages/home/index', ['/pages/home/index', '/pages/me/index'])).toBe(true)
    expect(isTabBarPage('/pages/detail', ['/pages/home/index'])).toBe(false)
  })
})

describe('navigateToPage', () => {
  beforeEach(() => vi.clearAllMocks())

  it('uses switchTab when target is a tab page', async () => {
    (globalThis as any).uni.switchTab = vi.fn((opts) => opts.success?.())
    ;(globalThis as any).uni.navigateTo = vi.fn()
    await navigateToPage('/pages/home/index', {
      tabBarPages: ['/pages/home/index'], tourId: 't', stepId: 's',
    })
    expect(uni.switchTab).toHaveBeenCalledOnce()
    expect(uni.navigateTo).not.toHaveBeenCalled()
  })

  it('uses navigateTo when target is non-tab page', async () => {
    (globalThis as any).uni.switchTab = vi.fn()
    ;(globalThis as any).uni.navigateTo = vi.fn((opts) => opts.success?.())
    await navigateToPage('/pages/detail/x', {
      tabBarPages: ['/pages/home/index'], tourId: 't', stepId: 's',
    })
    expect(uni.navigateTo).toHaveBeenCalledOnce()
  })

  it('rejects with GuideRouteFailedError when uni reports fail', async () => {
    (globalThis as any).uni.navigateTo = vi.fn((opts) => opts.fail?.({ errMsg: 'boom' }))
    await expect(navigateToPage('/pages/x', {
      tabBarPages: [], tourId: 't', stepId: 's',
    })).rejects.toThrow(GuideRouteFailedError)
  })
})
