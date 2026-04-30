import { describe, it, expect } from 'vitest'
import { validateTour } from '../../src/validate'
import { InvalidStepError } from '../../src/errors'

const validStep = {
  id: 's1', page: '/pages/home/index', target: 't1',
  title: 'T', content: 'C', button: 'OK',
}

describe('validateTour', () => {
  it('passes valid config', () => {
    expect(() => validateTour({ id: 'tour', steps: [validStep] })).not.toThrow()
  })
  it('throws when id missing', () => {
    expect(() => validateTour({ id: '', steps: [validStep] })).toThrow(InvalidStepError)
  })
  it('throws when steps empty', () => {
    expect(() => validateTour({ id: 'tour', steps: [] })).toThrow(/at least one step/)
  })
  it('throws when step.id missing', () => {
    expect(() => validateTour({ id: 'tour', steps: [{ ...validStep, id: '' }] }))
      .toThrow(/step\[0\].id required/)
  })
  it('throws when step.target missing', () => {
    expect(() => validateTour({ id: 'tour', steps: [{ ...validStep, target: '' }] }))
      .toThrow(/step\[0\].target required/)
  })
  it('throws when step.page is relative path', () => {
    expect(() => validateTour({ id: 'tour', steps: [{ ...validStep, page: 'pages/home' }] }))
      .toThrow(/must be absolute/)
  })
  it('allows query string in page', () => {
    expect(() => validateTour({ id: 'tour', steps: [{ ...validStep, page: '/pages/x?a=b' }] }))
      .not.toThrow()
  })
  it('throws when placement invalid', () => {
    expect(() => validateTour({ id: 'tour', steps: [{ ...validStep, placement: 'middle' as any }] }))
      .toThrow(/placement invalid/)
  })
  it('throws when step.id is not unique', () => {
    expect(() => validateTour({ id: 'tour', steps: [validStep, validStep] }))
      .toThrow(/duplicate step id/)
  })
})
