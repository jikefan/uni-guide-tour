import type { TourStatus } from '../types'

export const ALL_TRANSITIONS: ReadonlyArray<[TourStatus, TourStatus]> = [
  ['idle', 'running'],
  ['running', 'paused'],
  ['paused', 'running'],
  ['running', 'awaiting-route'],
  ['awaiting-route', 'running'],
  ['awaiting-route', 'paused'],
  ['running', 'completed'],
  ['completed', 'idle'],
  ['paused', 'idle'],
  ['running', 'idle'],
]

export function canTransition(from: TourStatus, to: TourStatus): boolean {
  return ALL_TRANSITIONS.some(([a, b]) => a === from && b === to)
}
