import type { Rect, Placement } from '../types'

export interface TipSize { width: number; height: number }
export interface ScreenInfo {
  width: number; height: number
  statusBarHeight: number; safeBottom: number
}
export interface TipPos { top: number; left: number; arrow: 'top' | 'bottom' | 'left' | 'right' }

const GAP = 12
const SAFE_PAD = 8

export function computeTipPosition(
  hole: Rect, tip: TipSize, placement: Placement, screen: ScreenInfo,
): TipPos {
  const finalPlacement: Exclude<Placement, 'auto'> =
    placement === 'auto' ? pickAutoPlacement(hole, tip, screen) : placement

  let top = 0, left = 0, arrow: TipPos['arrow'] = 'top'

  switch (finalPlacement) {
    case 'bottom':
      top = hole.top + hole.height + GAP
      left = hole.left + hole.width / 2 - tip.width / 2
      arrow = 'top'; break
    case 'top':
      top = hole.top - GAP - tip.height
      left = hole.left + hole.width / 2 - tip.width / 2
      arrow = 'bottom'; break
    case 'right':
      top = hole.top + hole.height / 2 - tip.height / 2
      left = hole.left + hole.width + GAP
      arrow = 'left'; break
    case 'left':
      top = hole.top + hole.height / 2 - tip.height / 2
      left = hole.left - GAP - tip.width
      arrow = 'right'; break
  }

  const minTop = screen.statusBarHeight + SAFE_PAD
  const maxTop = screen.height - screen.safeBottom - tip.height - SAFE_PAD
  const minLeft = SAFE_PAD
  const maxLeft = screen.width - tip.width - SAFE_PAD

  top = Math.max(minTop, Math.min(maxTop, top))
  left = Math.max(minLeft, Math.min(maxLeft, left))

  return { top, left, arrow }
}

function pickAutoPlacement(hole: Rect, tip: TipSize, s: ScreenInfo): Exclude<Placement, 'auto'> {
  const spaceBottom = s.height - s.safeBottom - (hole.top + hole.height) - GAP
  if (spaceBottom >= tip.height) return 'bottom'
  const spaceTop = hole.top - s.statusBarHeight - GAP
  if (spaceTop >= tip.height) return 'top'
  const spaceRight = s.width - (hole.left + hole.width) - GAP
  if (spaceRight >= tip.width) return 'right'
  return 'left'
}
