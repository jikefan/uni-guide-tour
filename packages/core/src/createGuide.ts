import { computed, type App, type Plugin } from 'vue'
import { createPinia, getActivePinia } from 'pinia'
import type { CreateGuideOptions, ProgressInfo, Step, Tour, TourId } from './types'
import { GuideEngine } from './engine/GuideEngine'
import { useGuideStore } from './store/guideStore'
import { GuideKey } from './composables/useGuide'
import { vGuideTarget } from './directives/vGuideTarget'
import { createUniStorageAdapter } from './adapters/uniStorageAdapter'
import { locateTarget } from './platform/locate'
import { navigateToPage } from './platform/route'
import { onPageEnter, getCurrentPagePath } from './platform/pageEvents'
import { getScreenInfo, onResize, pageScrollTo } from './platform/system'
import GuideMask from './components/GuideMask.vue'
import { getStepByIndex } from './engine/StepResolver'

export function createGuide(opts: CreateGuideOptions = {}): Plugin {
  return {
    install(app: App) {
      if (!getActivePinia()) app.use(createPinia())
      const store = useGuideStore()
      const storage = opts.storage ?? createUniStorageAdapter()
      const tours = new Map<TourId, Tour>()

      const engine: GuideEngine = new GuideEngine({
        store,
        locate: async (target, c) => {
          const pages = (typeof getCurrentPages !== 'undefined') ? getCurrentPages() : []
          const page = pages[pages.length - 1]
          return await locateTarget(target, { ...c, page })
        },
        navigate: (page: string): Promise<void> => navigateToPage(page, {
          tabBarPages: [], tourId: engine.currentTour.value?.id ?? '', stepId: '',
        }),
        waitForRoute: (page, timeoutMs = 5000) => new Promise<void>((res, rej) => {
          let off: (() => void) | null = null
          const timer = setTimeout(() => {
            off?.(); rej(new Error(`route timeout: ${page}`))
          }, timeoutMs)
          off = onPageEnter((p) => {
            if (p === page) { clearTimeout(timer); off?.(); res() }
          })
        }),
        getCurrentPage: () => getCurrentPagePath(),
        getScreenInfo,
        pageScrollTo: (offset) => pageScrollTo(offset),
      })

      store.attachStorage(storage, {
        onStorageError: (err) => {
          engine.currentTour.value?.onStorageError?.({ error: err })
          console.warn('[uni-guide-tour] storage error:', err)
        },
      })

      const currentStep = computed<Step | null>(() => {
        if (!engine.currentTour.value) return null
        // Only surface a step while the tour is actively viewable.
        // After completeTour() the engine still holds currentTour for
        // bookkeeping, but the mask should disappear.
        if (store.status !== 'running' &&
            store.status !== 'paused' &&
            store.status !== 'awaiting-route') return null
        return getStepByIndex(engine.currentTour.value, store.currentStepIndex)
      })
      const progress = computed<ProgressInfo>(() => {
        const total = engine.currentTour.value?.steps.length ?? 0
        const current = store.currentStepIndex + 1
        return { current, total, percent: total ? current / total : 0 }
      })

      app.provide(GuideKey, { engine, tours, currentStep: currentStep as any, progress: progress as any, currentRect: engine.currentRect })
      app.directive('guide-target', vGuideTarget)
      app.component('GuideMask', GuideMask)

      onResize(() => engine.relocate())

      if (opts.theme && typeof document !== 'undefined') {
        for (const [k, v] of Object.entries(opts.theme)) {
          document.documentElement.style.setProperty(k, v)
        }
      }
    },
  }
}
