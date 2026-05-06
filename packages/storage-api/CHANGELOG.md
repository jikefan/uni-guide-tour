# @uni-guide-tour/storage-api

## 1.0.0

### Minor Changes

- e087282: Initial v0.1.0 release.

  **Features:**

  - Cross-platform guided tour SDK for uniapp + Vue 3 (H5, mini-programs, App-vue)
  - Spotlight rendering via single-node `box-shadow` with rounded corners and smooth transitions
  - Cross-page step continuation with auto-resume after refresh
  - Pluggable `StorageAdapter` — default `uni.storage`; built-in REST adapter (`@uni-guide-tour/storage-api`) for cross-device persistence
  - Configuration-driven steps with full TypeScript inference (`defineTour`)
  - `useGuide()` composable + `v-guide-target` directive (or `:data-guide-target` binding for mini-program targets)
  - Custom tip cards via slot, themed via CSS variables

  **Supported targets:**

  - H5 (Tier 1, full e2e suite)
  - WeChat mini-program (Tier 1)
  - Xiaohongshu / Alipay / ByteDance / Baidu mini-programs (best-effort)
  - App-vue (best-effort)

  See [docs/guide/quick-start.md](https://github.com/jikefan/uni-guide-tour/tree/main/docs/guide/quick-start.md) to get started.

### Patch Changes

- Updated dependencies [e087282]
  - uni-guide-tour@0.1.0
