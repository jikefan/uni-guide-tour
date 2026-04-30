import type { Ref } from 'vue'
import type { GuideError } from './errors'

export type TourId = string
export type StepId = string
export type TargetKey = string

export type Placement = 'top' | 'bottom' | 'left' | 'right' | 'auto'
export type Transition = 'auto' | 'wait-for-route' | 'tap-target'
export type ResumeStrategy = 'continue' | 'restart' | 'ask'
export type TourStatus = 'idle' | 'running' | 'awaiting-route' | 'paused' | 'completed'

export type ContentSource = string | (() => string) | Ref<string>

export interface Rect {
  top: number
  left: number
  width: number
  height: number
}

export interface Step {
  id: StepId
  page: string
  target: TargetKey
  title: ContentSource
  content: ContentSource
  button: ContentSource
  placement?: Placement
  transition?: Transition
  clickThrough?: boolean
  autoScroll?: boolean
  locateRetries?: number
  locateIntervalMs?: number
  condition?: () => boolean
}

export interface TourLifecycle {
  onStart?: () => void
  onStepEnter?: (ctx: { step: Step; index: number }) => void
  onStepLeave?: (ctx: { step: Step; index: number }) => void
  onPause?: (ctx: { step: Step }) => void
  onResume?: (ctx: { step: Step }) => void
  onComplete?: () => void
  onSkip?: (ctx: { atStep: Step }) => void
  onError?: (ctx: { error: GuideError; step?: Step }) => void
  onStorageError?: (ctx: { error: Error }) => void
}

export interface TourConfig extends TourLifecycle {
  allowSkip?: boolean
  allowBack?: boolean
  resumeStrategy?: ResumeStrategy
  progressFormat?: string
  locateRetries?: number
  locateIntervalMs?: number
  steps: Step[]
}

export interface Tour extends TourConfig {
  id: TourId
}

export interface TourState {
  status: TourStatus
  currentStepIndex: number
  startedAt: number
  completedAt?: number
}

export interface ProgressInfo {
  current: number
  total: number
  percent: number
}

export interface StorageAdapter {
  get(tourId: TourId): Promise<TourState | null>
  set(tourId: TourId, state: TourState): Promise<void>
  clear(tourId: TourId): Promise<void>
}

export interface CreateGuideOptions {
  storage?: StorageAdapter
  theme?: Record<string, string>
  defaultLocateRetries?: number
  defaultLocateIntervalMs?: number
}

export interface ScreenInfo {
  width: number
  height: number
  statusBarHeight: number
  safeBottom: number
}

