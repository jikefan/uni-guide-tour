import { defineComponent, h, isRef, type PropType, type Ref, type SlotsType, type VNode } from 'vue'
import type { Rect, ContentSource } from '../types'

export interface GuideMaskProps {
  visible: boolean
  hole: Rect & { radius?: number }
  tipPosition: { top: number; left: number }
  title: ContentSource
  content: ContentSource
  button: ContentSource
  progressText: string
}

function resolve(v: ContentSource): string {
  if (typeof v === 'string') return v
  if (typeof v === 'function') return v()
  if (isRef(v)) return (v as Ref<string>).value
  return String(v)
}

export default defineComponent({
  name: 'GuideMask',
  props: {
    visible: { type: Boolean, required: true },
    hole: { type: Object as PropType<GuideMaskProps['hole']>, required: true },
    tipPosition: { type: Object as PropType<GuideMaskProps['tipPosition']>, required: true },
    title: { type: [String, Function, Object] as PropType<ContentSource>, required: true },
    content: { type: [String, Function, Object] as PropType<ContentSource>, required: true },
    button: { type: [String, Function, Object] as PropType<ContentSource>, required: true },
    progressText: { type: String, required: true },
  },
  emits: { next: () => true },
  slots: Object as SlotsType<{
    tip: (props: {
      title: ContentSource
      content: ContentSource
      button: ContentSource
      progressText: string
      next: () => void
    }) => any
  }>,
  setup(props, { emit, slots }) {
    const emitNext = () => emit('next')

    return () => {
      if (!props.visible) return null

      const holeStyle = {
        position: 'fixed',
        top: props.hole.top + 'px',
        left: props.hole.left + 'px',
        width: props.hole.width + 'px',
        height: props.hole.height + 'px',
        borderRadius: (props.hole.radius ?? 8) + 'px',
        background: 'transparent',
        boxShadow: '0 0 0 9999px var(--guide-mask-bg, rgba(0,0,0,.6))',
        transition: 'all .25s ease',
        pointerEvents: 'none',
      }

      const tipStyle = {
        position: 'fixed',
        top: props.tipPosition.top + 'px',
        left: props.tipPosition.left + 'px',
        background: 'var(--guide-tip-bg, #fff)',
        color: 'var(--guide-tip-color, #222)',
        borderRadius: 'var(--guide-tip-radius, 12px)',
        padding: '16px',
        maxWidth: '320px',
        boxShadow: '0 4px 16px rgba(0,0,0,.12)',
      }

      const slotProps = {
        title: props.title,
        content: props.content,
        button: props.button,
        progressText: props.progressText,
        next: emitNext,
      }

      const defaultTip = (): VNode[] => [
        h('view', { class: 'ugt-tip__title' }, resolve(props.title)),
        h('view', { class: 'ugt-tip__content' }, resolve(props.content)),
        h('view', { class: 'ugt-tip__footer' }, [
          h('text', { class: 'ugt-tip__progress' }, props.progressText),
          h('button', { class: 'ugt-tip__next', onClick: emitNext }, resolve(props.button)),
        ]),
      ]

      return h(
        'view',
        {
          class: 'ugt-root',
          style: { position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'auto' },
          onTouchmove: (e: TouchEvent) => { e.stopPropagation(); e.preventDefault() },
        },
        [
          h('view', { class: 'ugt-hole', style: holeStyle }),
          h('view', { class: 'ugt-tip', style: tipStyle },
            slots.tip ? slots.tip(slotProps) : defaultTip(),
          ),
        ],
      )
    }
  },
})
