import { InvalidStepError } from './errors'
import type { Tour } from './types'

const PLACEMENTS = ['top', 'bottom', 'left', 'right', 'auto'] as const
const TRANSITIONS = ['auto', 'wait-for-route', 'tap-target'] as const
const PAGE_PATH_RE = /^\/[\w\-/]+(\?[^\s]*)?$/

function assert(cond: any, msg: string, tourId?: string, stepId?: string): asserts cond {
  if (!cond) throw new InvalidStepError(msg, { tourId, stepId })
}

export function validateTour(t: Tour): void {
  assert(t.id, 'tour id required')
  assert(t.steps && t.steps.length > 0, `tour "${t.id}": at least one step`, t.id)
  const ids = new Set<string>()
  t.steps.forEach((s, i) => {
    const at = `step[${i}]`
    assert(s.id, `${at}.id required`, t.id)
    assert(!ids.has(s.id), `${at}: duplicate step id "${s.id}"`, t.id, s.id)
    ids.add(s.id)
    assert(s.target, `${at}.target required`, t.id, s.id)
    assert(s.page && PAGE_PATH_RE.test(s.page),
      `${at}.page must be absolute path starting with "/"`, t.id, s.id)
    if (s.placement !== undefined) {
      assert(PLACEMENTS.includes(s.placement),
        `${at}.placement invalid (got "${s.placement}")`, t.id, s.id)
    }
    if (s.transition !== undefined) {
      assert(TRANSITIONS.includes(s.transition),
        `${at}.transition invalid`, t.id, s.id)
    }
  })
}
