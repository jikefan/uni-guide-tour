import { GuideTargetNotFoundError } from '../errors'
import type { Rect, TargetKey, TourId, StepId } from '../types'

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms))

export interface LocateContext {
  tourId: TourId
  stepId: StepId
  page?: any
  retries?: number
  intervalMs?: number
}

export async function locateTarget(target: TargetKey, ctx: LocateContext): Promise<Rect> {
  const retries = ctx.retries ?? 10
  const intervalMs = ctx.intervalMs ?? 50
  for (let i = 0; i < retries; i++) {
    const rect = await queryOnce(target, ctx.page)
    if (rect && rect.width > 0) return rect
    if (i < retries - 1) await sleep(intervalMs)
  }
  throw new GuideTargetNotFoundError(ctx.tourId, ctx.stepId, target)
}

function queryOnce(target: TargetKey, page?: any): Promise<Rect | null> {
  return new Promise(resolve => {
    const q = page ? uni.createSelectorQuery().in(page) : uni.createSelectorQuery()
    q.select(`[data-guide-target="${target}"]`)
      .boundingClientRect(rect => resolve(rect as Rect | null))
      .exec()
  })
}
