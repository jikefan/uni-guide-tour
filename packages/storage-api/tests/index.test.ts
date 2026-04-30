import { describe, it, expect, vi } from 'vitest'
import { createApiStorage } from '../src/index'

describe('createApiStorage', () => {
  it('GET → parses JSON', async () => {
    const fetchMock = vi.fn(async () => ({ ok: true, status: 200,
      json: async () => ({ status: 'running', currentStepIndex: 1, startedAt: 100 }) }))
    const a = createApiStorage({ baseURL: '/api/guide', fetch: fetchMock as any })
    const r = await a.get('demo')
    expect(fetchMock).toHaveBeenCalledWith('/api/guide/demo', expect.any(Object))
    expect(r?.currentStepIndex).toBe(1)
  })
  it('GET 404 → null', async () => {
    const fetchMock = vi.fn(async () => ({ ok: false, status: 404 }))
    const a = createApiStorage({ baseURL: '/api/guide', fetch: fetchMock as any })
    expect(await a.get('demo')).toBeNull()
  })
  it('SET → PUT body', async () => {
    const fetchMock = vi.fn(async () => ({ ok: true, status: 200 }))
    const a = createApiStorage({ baseURL: '/api/guide', fetch: fetchMock as any })
    await a.set('demo', { status: 'running', currentStepIndex: 0, startedAt: 1 })
    expect(fetchMock).toHaveBeenCalledWith('/api/guide/demo', expect.objectContaining({
      method: 'PUT',
      headers: expect.objectContaining({ 'content-type': 'application/json' }),
    }))
  })
  it('CLEAR → DELETE', async () => {
    const fetchMock = vi.fn(async () => ({ ok: true, status: 204 }))
    const a = createApiStorage({ baseURL: '/api/guide', fetch: fetchMock as any })
    await a.clear('demo')
    expect(fetchMock).toHaveBeenCalledWith('/api/guide/demo', expect.objectContaining({ method: 'DELETE' }))
  })
  it('non-2xx other than 404 throws', async () => {
    const fetchMock = vi.fn(async () => ({ ok: false, status: 500 }))
    const a = createApiStorage({ baseURL: '/api/guide', fetch: fetchMock as any })
    await expect(a.get('demo')).rejects.toThrow(/500/)
  })
})
