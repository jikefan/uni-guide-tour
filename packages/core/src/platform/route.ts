import { GuideRouteFailedError } from '../errors'
import type { TourId, StepId } from '../types'

export function isTabBarPage(page: string, tabBarPages: string[]): boolean {
  return tabBarPages.includes(page)
}

export interface NavigateContext {
  tabBarPages: string[]
  tourId: TourId
  stepId: StepId
}

export function navigateToPage(page: string, ctx: NavigateContext): Promise<void> {
  return new Promise((resolve, reject) => {
    const fail = (err: any) => reject(new GuideRouteFailedError(
      ctx.tourId, ctx.stepId, page, new Error(err?.errMsg ?? 'unknown')))
    if (isTabBarPage(page, ctx.tabBarPages)) {
      uni.switchTab({ url: page, success: () => resolve(), fail })
    } else {
      uni.navigateTo({ url: page, success: () => resolve(), fail })
    }
  })
}
