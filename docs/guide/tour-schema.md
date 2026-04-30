# Tour Schema

```ts
defineTour(id: string, config: {
  allowSkip?: boolean
  allowBack?: boolean
  resumeStrategy?: 'continue' | 'restart' | 'ask'   // 'continue' is the default
  progressFormat?: string
  locateRetries?: number          // default 10
  locateIntervalMs?: number       // default 50
  steps: Step[]
  onStart?, onStepEnter?, onStepLeave?, onPause?, onResume?,
  onComplete?, onSkip?, onError?, onStorageError?,
})
```

## Step

```ts
{
  id: string                       // unique within tour
  page: string                     // absolute path, may include '?query'
  target: string                   // matches v-guide-target value
  title, content, button: string | (() => string) | Ref<string>
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'auto'   // default 'auto'
  transition?: 'auto' | 'wait-for-route' | 'tap-target'      // default 'auto'
  clickThrough?: boolean           // default false
  autoScroll?: boolean             // default true
  locateRetries?: number           // overrides tour
  locateIntervalMs?: number        // overrides tour
  condition?: () => boolean        // skip step if false
}
```

> **Note:** `resumeStrategy` is the **policy** field for what happens when an interrupted tour is opened again. The lifecycle callback `onResume({ step })` (a function) is separate — it fires *after* the engine resumes a paused tour.
