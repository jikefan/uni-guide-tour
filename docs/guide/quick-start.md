# Quick Start

## Install

```bash
pnpm add uni-guide-tour
```

## Initialize

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

## Define a tour

```ts
// tours/onboarding.ts
import { defineTour } from 'uni-guide-tour'

export default defineTour('onboarding', {
  resumeStrategy: 'continue',
  steps: [
    { id: 'card-1', page: '/pages/home/index', target: 'card-1',
      title: 'Welcome', content: 'This is your first card', button: 'Got it' },
  ],
})
```

## Mark targets in templates

```vue
<view v-guide-target="'card-1'">My target</view>
```

## Render the mask

Mount a global mask renderer (recommended pattern — see [Recipes](/guide/recipes#guideroot-vue) for the full file):

```vue
<!-- App.vue -->
<GuideRoot />
```

## Start the tour

```ts
import { useGuide } from 'uni-guide-tour'
import onboarding from '@/tours/onboarding'

const guide = useGuide()
await guide.register(onboarding)        // auto-hydrates persisted state
guide.start('onboarding')
```
