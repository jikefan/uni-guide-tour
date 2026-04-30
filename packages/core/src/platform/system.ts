import type { ScreenInfo } from '../types'

export function getScreenInfo(): ScreenInfo {
  const s = uni.getSystemInfoSync()
  return {
    width: s.windowWidth ?? 375,
    height: s.windowHeight ?? 812,
    statusBarHeight: s.statusBarHeight ?? 0,
    safeBottom: (s as any).safeAreaInsets?.bottom ?? 0,
  }
}
export function onResize(cb: () => void): () => void {
  uni.onWindowResize?.(cb)
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', cb)
  }
  return () => {
    (uni as any).offWindowResize?.(cb)
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', cb)
    }
  }
}
export async function pageScrollTo(scrollTop: number, duration = 200): Promise<void> {
  return new Promise(res => {
    uni.pageScrollTo({ scrollTop, duration, complete: () => res() } as any)
  })
}
