import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGuideStore } from '../../src/store/guideStore'
import { GuideEngine } from '../../src/engine/GuideEngine'
import { GuideTargetNotFoundError } from '../../src/errors'

describe('GuideEngine error handling', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('locate failure → pause + onError called', async () => {
    const onError = vi.fn()
    const tour = {
      id: 't',
      steps: [{ id: 's1', page: '/p1', target: 't1', title: '', content: '', button: '' }],
      onError,
    } as any
    const store = useGuideStore()
    store.attachStorage({ get: async()=>null, set: async()=>{}, clear: async()=>{} })
    const e = new GuideEngine({
      store,
      locate: async () => { throw new GuideTargetNotFoundError('t', 's1', 't1') },
      navigate: vi.fn(), waitForRoute: vi.fn(), getCurrentPage: () => '/p1',
    })
    await e.start(tour)
    expect(store.status).toBe('paused')
    expect(onError).toHaveBeenCalledWith(expect.objectContaining({
      error: expect.any(GuideTargetNotFoundError),
      step: tour.steps[0],
    }))
  })
})
