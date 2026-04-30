import type { Tour, TourConfig, TourId } from './types'
import { validateTour } from './validate'

export function defineTour(id: TourId, config: TourConfig): Tour {
  const tour: Tour = { id, ...config }
  validateTour(tour)
  return tour
}
