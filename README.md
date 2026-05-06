# uni-guide-tour

> Cross-platform guided tour SDK for [uniapp](https://uniapp.dcloud.net.cn/) + Vue 3 — H5, mini-programs (WeChat / Xiaohongshu / Alipay / ByteDance / Baidu / etc.), and App-vue.

[![CI](https://github.com/jikefan/uni-guide-tour/actions/workflows/ci.yml/badge.svg)](https://github.com/jikefan/uni-guide-tour/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Features

- 🎯 **Spotlight rendering** via single-node `box-shadow` (smooth transitions, rounded corners)
- 🚀 **Cross-page step continuation** — engine drives `uni.navigateTo` / `switchTab` and resumes after refresh
- 🔌 **Pluggable storage adapter** — default `uni.storage`; built-in REST adapter package for cross-device sync
- 📝 **Configuration-driven** steps with full TypeScript inference
- 🎨 **Custom tip cards** via slot, themed via CSS variables
- 💯 100% TypeScript

## Quick Start

```bash
pnpm add uni-guide-tour
```

```ts
// main.ts
import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import { createGuide } from 'uni-guide-tour'
import 'uni-guide-tour/style.css'
import App from './App.vue'

export function createApp() {
  const app = createSSRApp(App)
  app.use(createPinia())
  app.use(createGuide())
  return { app }
}
```

```ts
// tours/onboarding.ts
import { defineTour } from 'uni-guide-tour'
export default defineTour('onboarding', {
  resumeStrategy: 'continue',
  steps: [
    { id: 'a', page: '/pages/home/index', target: 'card-1',
      title: 'Welcome', content: 'Click next', button: 'Got it' },
  ],
})
```

```vue
<!-- pages/home/index.vue -->
<view v-guide-target="'card-1'">My target</view>
```

```ts
// any setup
import { useGuide } from 'uni-guide-tour'
import onboarding from '@/tours/onboarding'

const guide = useGuide()
await guide.register(onboarding)         // auto-hydrates persisted state
guide.start('onboarding')
```

[**Full docs →**](https://github.com/jikefan/uni-guide-tour/tree/main/docs/guide)

## Platform Support

| Platform | Status | Notes |
|---|---|---|
| H5 | ✅ Tier 1 (CI) | full e2e suite |
| WeChat MP | ✅ Tier 1 | use `:data-guide-target` (mp can't transform custom directives) |
| Xiaohongshu MP | ⚠️ Best-effort | smoke tested, no CI |
| Alipay / ByteDance / Baidu | ⚠️ Best-effort | should work, untested |
| App-vue | ⚠️ Best-effort | webview rendering |
| App-nvue | ❌ Roadmap (v0.2) | requires native renderer |

## Packages in this repo

- [`uni-guide-tour`](packages/core) — the core SDK
- [`@uni-guide-tour/storage-api`](packages/storage-api) — REST `StorageAdapter` for cross-device persistence

## Examples

- [`examples/h5-demo`](examples/h5-demo) — H5 demo with 5-step tour, runs `pnpm dev:h5` then opens in browser
- [`examples/mp-weixin-demo`](examples/mp-weixin-demo) — WeChat mini-program demo, run `pnpm --filter mp-weixin-demo dev:mp-weixin` then open `dist/dev/mp-weixin/` in WeChat DevTools

## Development

```bash
pnpm install
pnpm -r --filter './packages/*' build       # build core + storage-api
pnpm test                                    # run unit tests
pnpm --filter h5-demo test:e2e              # run Playwright e2e
pnpm dev:h5                                  # run H5 demo locally
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full workflow.

## License

[MIT](LICENSE) © 2026 jikefan
