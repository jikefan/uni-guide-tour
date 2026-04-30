import type { Step, Tour, StepId } from '../types'

export function findStepIndex(tour: Tour, stepId: StepId): number {
  return tour.steps.findIndex(s => s.id === stepId)
}

export function isStepOnPage(step: Step, page: string): boolean {
  const stepPath = step.page.split('?')[0]
  return stepPath === page
}

export function getStepByIndex(tour: Tour, index: number): Step | null {
  if (index < 0 || index >= tour.steps.length) return null
  return tour.steps[index]
}
