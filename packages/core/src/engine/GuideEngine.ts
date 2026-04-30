import type { Rect, Tour, ScreenInfo } from '../types'
import type { useGuideStore } from '../store/guideStore'
import { driveTransition } from './TransitionDriver'
import { getStepByIndex } from './StepResolver'

export interface EngineDeps {
  store: ReturnType<typeof useGuideStore>
  locate: (
    target: string,
    opts: { tourId: string; stepId: string; page?: any; retries?: number; intervalMs?: number },
  ) => Promise<Rect>
  navigate: (page: string) => Promise<void>
  waitForRoute: (page: string, timeoutMs?: number) => Promise<void>
  getCurrentPage: () => string
  getScreenInfo?: () => ScreenInfo
  pageScrollTo?: (offset: number) => Promise<void>
  tapTarget?: () => void
}

export interface StartOpts { force?: boolean }

export class GuideEngine {
  store: EngineDeps['store']
  deps: EngineDeps
  currentTour: Tour | null = null
  currentRect: Rect | null = null

  constructor(deps: EngineDeps) {
    this.deps = deps
    this.store = deps.store
  }

  async start(tour: Tour, opts: StartOpts = {}) {
    if (this.store.completedTours[tour.id] && !opts.force) return
    this.currentTour = tour
    if (opts.force) await this.store.clearTour(tour.id)
    await this.store.startTour(tour.id)
    tour.onStart?.()
    await this._showCurrentStep()
  }

  async next() {
    if (!this.currentTour) return
    const t = this.currentTour
    const idx = this.store.currentStepIndex
    const step = getStepByIndex(t, idx)
    if (step) t.onStepLeave?.({ step, index: idx })
    if (idx + 1 >= t.steps.length) {
      await this.store.completeTour()
      t.onComplete?.()
      return
    }
    await this.store.advance()
    await this._showCurrentStep()
  }

  async _showCurrentStep() {
    if (!this.currentTour) return
    const t = this.currentTour
    const idx = this.store.currentStepIndex
    const step = getStepByIndex(t, idx)
    if (!step) return
    if (step.condition && !step.condition()) {
      await this.next()
      return
    }

    const tr = await driveTransition({
      step,
      currentPage: this.deps.getCurrentPage(),
      navigate: this.deps.navigate,
      waitForRoute: this.deps.waitForRoute,
      tapTarget: this.deps.tapTarget,
    })
    if (tr.kind === 'awaiting') {
      await this.store.awaitRoute()
      return
    }

    try {
      const baseRetries = step.locateRetries ?? t.locateRetries ?? 10
      const intervalMs = step.locateIntervalMs ?? t.locateIntervalMs ?? 50
      const finalRetries = tr.kind === 'navigated' ? Math.max(baseRetries * 2, 20) : baseRetries
      this.currentRect = await this.deps.locate(step.target, {
        tourId: t.id,
        stepId: step.id,
        retries: finalRetries,
        intervalMs,
      })

      // Auto-scroll if off-screen
      const screen = this.deps.getScreenInfo?.()
      if (
        (step.autoScroll ?? true) &&
        screen &&
        this.deps.pageScrollTo &&
        (this.currentRect.top < 0 ||
          this.currentRect.top + this.currentRect.height > screen.height)
      ) {
        await this.deps.pageScrollTo(this.currentRect.top - 100)
        await new Promise(r => setTimeout(r, 250))
        this.currentRect = await this.deps.locate(step.target, {
          tourId: t.id,
          stepId: step.id,
          retries: 5,
          intervalMs,
        })
      }
    } catch (e: any) {
      await this.store.pause()
      t.onError?.({ error: e, step })
      return
    }
    t.onStepEnter?.({ step, index: idx })
  }

  async relocate() {
    if (!this.currentTour || this.store.status !== 'running') return
    const step = getStepByIndex(this.currentTour, this.store.currentStepIndex)
    if (!step) return
    try {
      this.currentRect = await this.deps.locate(step.target, {
        tourId: this.currentTour.id,
        stepId: step.id,
        retries: 5,
        intervalMs: 30,
      })
    } catch {}
  }

  async stop() {
    await this.store.stopTour()
    this.currentTour = null
    this.currentRect = null
  }
}
