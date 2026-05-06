import { expectTypeOf, describe, it } from 'vitest'
import {
  defineTour,
  useGuide,
  createGuide,
  type Tour,
  type StorageAdapter,
  type ProgressInfo,
} from '../../src'

describe('public types', () => {
  it('defineTour returns Tour', () => {
    const t = defineTour('x', {
      steps: [
        {
          id: 's',
          page: '/p',
          target: 't',
          title: 'a',
          content: 'b',
          button: 'c',
        },
      ],
    })
    expectTypeOf(t).toEqualTypeOf<Tour>()
  })

  it('createGuide accepts storage', () => {
    expectTypeOf(createGuide).parameter(0).toMatchTypeOf<{ storage?: StorageAdapter } | undefined>()
  })

  it('useGuide().progress is ProgressInfo', () => {
    type R = ReturnType<typeof useGuide>
    expectTypeOf<R['progress']['value']>().toEqualTypeOf<ProgressInfo>()
  })
})
