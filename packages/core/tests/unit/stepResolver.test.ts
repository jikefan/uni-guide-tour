import { describe, it, expect } from 'vitest'
import { findStepIndex, isStepOnPage, getStepByIndex } from '../../src/engine/StepResolver'

const tour = {
  id: 't', steps: [
    { id: 'a', page: '/pages/p1', target: 't1', title: '', content: '', button: '' },
    { id: 'b', page: '/pages/p1', target: 't2', title: '', content: '', button: '' },
    { id: 'c', page: '/pages/p2', target: 't3', title: '', content: '', button: '' },
  ],
} as any

describe('StepResolver', () => {
  it('findStepIndex by id', () => {
    expect(findStepIndex(tour, 'b')).toBe(1)
    expect(findStepIndex(tour, 'missing')).toBe(-1)
  })
  it('isStepOnPage strips query', () => {
    expect(isStepOnPage(tour.steps[0], '/pages/p1')).toBe(true)
    expect(isStepOnPage({ ...tour.steps[0], page: '/pages/p1?a=b' }, '/pages/p1')).toBe(true)
    expect(isStepOnPage(tour.steps[2], '/pages/p1')).toBe(false)
  })
  it('getStepByIndex bounds-safe', () => {
    expect(getStepByIndex(tour, 0)?.id).toBe('a')
    expect(getStepByIndex(tour, 99)).toBeNull()
    expect(getStepByIndex(tour, -1)).toBeNull()
  })
})
