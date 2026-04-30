import { describe, it, expect } from 'vitest'
import { defineTour } from '../../src/defineTour'

const step = { id: 's1', page: '/pages/home/index', target: 't1', title: 'T', content: 'C', button: 'OK' }

describe('defineTour', () => {
  it('returns Tour with id', () => {
    const tour = defineTour('onboarding', { steps: [step] })
    expect(tour.id).toBe('onboarding')
    expect(tour.steps[0].id).toBe('s1')
  })
  it('validates synchronously and throws on invalid', () => {
    expect(() => defineTour('bad', { steps: [] })).toThrow()
  })
  it('preserves lifecycle hooks', () => {
    const onStart = () => {}
    const tour = defineTour('t', { steps: [step], onStart })
    expect(tour.onStart).toBe(onStart)
  })
})
