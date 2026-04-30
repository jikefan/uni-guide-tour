import { inject, type InjectionKey, type Ref } from 'vue'
import type { GuideEngine } from '../engine/GuideEngine'
import type { Tour, TourId, ProgressInfo, Step, Rect } from '../types'
import { TourNotRegisteredError, ConcurrentTourError } from '../errors'

export const GuideKey: InjectionKey<{
  engine: GuideEngine
  tours: Map<TourId, Tour>
  currentStep: Ref<Step | null>
  progress: Ref<ProgressInfo>
  currentRect: Ref<Rect | null>
}> = Symbol('uni-guide-tour')

export function useGuide() {
  const ctx = inject(GuideKey)
  if (!ctx) throw new Error('useGuide() must be used after app.use(createGuide())')

  async function register(tour: Tour) {
    ctx!.tours.set(tour.id, tour)
    // Hydrate this tour's state from storage (completed/running/paused).
    await ctx!.engine.store.hydrate([tour.id])
    // If hydrate restored a running/paused/awaiting state matching this tour, resume.
    const store = ctx!.engine.store
    if (store.activeTour === tour.id &&
        (store.status === 'running' ||
         store.status === 'paused' ||
         store.status === 'awaiting-route')) {
      ctx!.engine.currentTour.value = tour
      await (ctx!.engine as any)._showCurrentStep()
    }
  }
  async function start(id: TourId, opts: { force?: boolean } = {}) {
    const tour = ctx!.tours.get(id)
    if (!tour) throw new TourNotRegisteredError(id)
    if (ctx!.engine.store.status === 'running' && ctx!.engine.currentTour.value?.id !== id) {
      throw new ConcurrentTourError(ctx!.engine.currentTour.value!.id, id)
    }
    await ctx!.engine.start(tour, opts)
  }
  function next()  { return ctx!.engine.next() }
  function stop()  { return ctx!.engine.stop() }
  function isCompleted(id: TourId) {
    return Boolean(ctx!.engine.store.completedTours[id])
  }

  return {
    register, start, next, stop, isCompleted,
    currentStep: ctx.currentStep,
    progress: ctx.progress,
    currentRect: ctx.currentRect,
  }
}
