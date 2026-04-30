import type { TourId, StepId } from './types'

export class GuideError extends Error {
  code: string
  tourId?: TourId
  stepId?: StepId
  constructor(code: string, message: string, ctx: { tourId?: TourId; stepId?: StepId } = {}) {
    super(message)
    this.name = 'GuideError'
    this.code = code
    this.tourId = ctx.tourId
    this.stepId = ctx.stepId
  }
}

export class InvalidStepError extends GuideError {
  constructor(message: string, ctx: { tourId?: TourId; stepId?: StepId } = {}) {
    super('INVALID_STEP', message, ctx)
    this.name = 'InvalidStepError'
  }
}

export class TourNotRegisteredError extends GuideError {
  constructor(tourId: TourId) {
    super('TOUR_NOT_REGISTERED', `tour "${tourId}" not registered`, { tourId })
    this.name = 'TourNotRegisteredError'
  }
}

export class ConcurrentTourError extends GuideError {
  constructor(running: TourId, attempted: TourId) {
    super(
      'CONCURRENT_TOUR',
      `tour "${running}" is running; cannot start "${attempted}"`,
      { tourId: attempted },
    )
    this.name = 'ConcurrentTourError'
  }
}

export class GuideTargetNotFoundError extends GuideError {
  constructor(tourId: TourId, stepId: StepId, target: string) {
    super('TARGET_NOT_FOUND', `target "${target}" not found in step "${stepId}"`, { tourId, stepId })
    this.name = 'GuideTargetNotFoundError'
  }
}

export class GuideRouteFailedError extends GuideError {
  constructor(tourId: TourId, stepId: StepId, page: string, cause?: Error) {
    super('ROUTE_FAILED', `route to "${page}" failed: ${cause?.message ?? 'timeout'}`, { tourId, stepId })
    this.name = 'GuideRouteFailedError'
  }
}

export class StorageError extends GuideError {
  constructor(message: string, cause?: Error) {
    super('STORAGE_FAILED', `${message}${cause ? `: ${cause.message}` : ''}`)
    this.name = 'StorageError'
  }
}
