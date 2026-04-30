import { describe, it, expect } from 'vitest'
import { canTransition, ALL_TRANSITIONS } from '../../src/engine/StateMachine'

describe('StateMachine.canTransition', () => {
  it('idle → running ok', () => { expect(canTransition('idle', 'running')).toBe(true) })
  it('idle → completed not ok', () => { expect(canTransition('idle', 'completed')).toBe(false) })
  it('running → awaiting-route ok', () => { expect(canTransition('running', 'awaiting-route')).toBe(true) })
  it('completed → running not ok (use force/restart instead)', () => {
    expect(canTransition('completed', 'running')).toBe(false)
  })
  it('completed → idle ok (stop/reset)', () => { expect(canTransition('completed', 'idle')).toBe(true) })
  it('exposes all valid transitions', () => { expect(ALL_TRANSITIONS.length).toBeGreaterThan(5) })
})
