import type { Step } from '../types'

export type TransitionResult =
  | { kind: 'immediate' }
  | { kind: 'navigated'; toPage: string }
  | { kind: 'awaiting'; toPage: string }

export interface DriveCtx {
  step: Step
  currentPage: string
  navigate: (page: string) => Promise<void>
  waitForRoute: (page: string, timeoutMs?: number) => Promise<void>
  tapTarget?: () => void
}

export async function driveTransition(ctx: DriveCtx): Promise<TransitionResult> {
  const stepPath = ctx.step.page.split('?')[0]
  const samePage = stepPath === ctx.currentPage
  const transition = ctx.step.transition ?? 'auto'

  if (samePage && transition === 'auto') return { kind: 'immediate' }
  if (transition === 'wait-for-route') return { kind: 'awaiting', toPage: stepPath }
  if (transition === 'tap-target') {
    ctx.tapTarget?.()
    return { kind: 'awaiting', toPage: stepPath }
  }
  await ctx.navigate(ctx.step.page)
  return { kind: 'navigated', toPage: stepPath }
}
