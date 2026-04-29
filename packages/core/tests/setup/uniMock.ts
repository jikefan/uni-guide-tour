import { vi } from 'vitest'

;(globalThis as any).uni = {
  getSystemInfoSync: vi.fn(() => ({
    statusBarHeight: 20,
    safeAreaInsets: { bottom: 34 },
    windowWidth: 375,
    windowHeight: 812,
    pixelRatio: 2,
  })),
  setStorageSync: vi.fn(),
  getStorageSync: vi.fn(() => ''),
  removeStorageSync: vi.fn(),
  createSelectorQuery: vi.fn(),
  navigateTo: vi.fn((opts: any) => opts.success?.()),
  switchTab: vi.fn((opts: any) => opts.success?.()),
  pageScrollTo: vi.fn(),
  onWindowResize: vi.fn(),
}
