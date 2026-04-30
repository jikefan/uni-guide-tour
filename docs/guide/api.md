# API

## createGuide(opts) → Vue Plugin

Install once at app start.

```ts
createGuide({
  storage?: StorageAdapter
  theme?: Record<string, string>     // e.g. { '--guide-mask-bg': 'rgba(0,0,0,0.7)' }
})
```

## defineTour(id, config) → Tour
Validates config synchronously. Throws `InvalidStepError` on failure.

## useGuide() → Object
Returns `{ register, start, next, stop, isCompleted, currentStep, progress, currentRect }`.

`register()` is async — it auto-hydrates persisted state for the registered tour. If a running/paused tour is found in storage, the engine resumes it automatically.

## v-guide-target directive
Marks an element as a tour target. Pass a string key matching `step.target`.

## GuideMask component
Default mask renderer. Auto-registered globally by the plugin.

## StorageAdapter interface
```ts
interface StorageAdapter {
  get(tourId): Promise<TourState | null>
  set(tourId, state): Promise<void>
  clear(tourId): Promise<void>
}
```

Default impl: `createUniStorageAdapter()` (uni.storage). REST impl: `@uni-guide-tour/storage-api`.

## Errors
`GuideTargetNotFoundError` | `GuideRouteFailedError` | `ConcurrentTourError` | `TourNotRegisteredError` | `StorageError` | `InvalidStepError` (all extend `GuideError`).
