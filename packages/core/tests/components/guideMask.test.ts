import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import GuideMask from '../../src/components/GuideMask'

describe('GuideMask', () => {
  const baseHole = { top: 100, left: 50, width: 200, height: 80 }
  const baseTip = { top: 200, left: 50 }

  it('renders nothing when visible=false', () => {
    const w = mount(GuideMask, {
      props: { visible: false, hole: baseHole, tipPosition: baseTip,
               title: 'T', content: 'C', button: 'OK', progressText: '1/3' },
    })
    expect(w.find('.ugt-root').exists()).toBe(false)
  })

  it('positions hole using inline style from props', () => {
    const w = mount(GuideMask, {
      props: { visible: true, hole: baseHole, tipPosition: baseTip,
               title: 'T', content: 'C', button: 'OK', progressText: '1/3' },
    })
    const hole = w.find('.ugt-hole')
    expect(hole.attributes('style')).toContain('top: 100px')
    expect(hole.attributes('style')).toContain('left: 50px')
    expect(hole.attributes('style')).toContain('width: 200px')
    expect(hole.attributes('style')).toContain('height: 80px')
  })

  it('emits "next" when default tip button clicked', async () => {
    const w = mount(GuideMask, {
      props: { visible: true, hole: baseHole, tipPosition: baseTip,
               title: 'T', content: 'C', button: 'OK', progressText: '1/3' },
    })
    await w.find('.ugt-tip__next').trigger('click')
    expect(w.emitted('next')).toBeTruthy()
  })

  it('renders custom tip via slot', () => {
    const w = mount(GuideMask, {
      props: { visible: true, hole: baseHole, tipPosition: baseTip,
               title: 'T', content: 'C', button: 'OK', progressText: '1/3' },
      slots: { tip: '<div class="custom-tip">CUSTOM</div>' },
    })
    expect(w.find('.custom-tip').exists()).toBe(true)
    expect(w.find('.ugt-tip__title').exists()).toBe(false)
  })
})
