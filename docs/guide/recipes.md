# Recipes

## Marking targets across platforms

The `v-guide-target` directive is the H5/web ergonomic way:

```vue
<view v-guide-target="'card-1'">My target</view>
```

For **mini-program targets** (WeChat, Xiaohongshu, Alipay, etc.), uniapp's MP compiler doesn't transform custom directives. Use the `:data-guide-target` binding directly — it's the same effect:

```vue
<view :data-guide-target="'card-1'">My target</view>
```

The `locate.ts` engine selector `[data-guide-target="..."]` matches both forms. Pick one based on your target.

## Custom storage backend (REST)

```ts
import { createGuide } from 'uni-guide-tour'
import { createApiStorage } from '@uni-guide-tour/storage-api'

app.use(createGuide({
  storage: createApiStorage({ baseURL: 'https://api.example.com/guide' }),
}))
```

## i18n via vue-i18n

```ts
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

defineTour('onboarding', {
  steps: [
    { id: 's1', page: '/...', target: '...',
      title: computed(() => t('guide.s1.title')),
      content: computed(() => t('guide.s1.content')),
      button: computed(() => t('common.next')),
    },
  ],
})
```

## Re-trigger a completed tour

```ts
guide.start('onboarding', { force: true })
```

## GuideRoot.vue (recommended global mask renderer)

```vue
<template>
  <Teleport to="body">
    <GuideMask
      v-if="visible"
      :visible="true"
      :hole="{ ...currentRect!, radius: 8 }"
      :tipPosition="tipPos"
      :title="currentStep!.title"
      :content="currentStep!.content"
      :button="currentStep!.button"
      :progressText="`${progress.current}/${progress.total}`"
      @next="next"
    />
  </Teleport>
</template>
<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useGuide, GuideMask, computeTipPosition } from 'uni-guide-tour'

const { currentStep, progress, next, currentRect } = useGuide()
const tipPos = ref({ top: 0, left: 0 })

watch([currentStep, currentRect], () => {
  if (!currentStep.value || !currentRect.value) return
  const sys = uni.getSystemInfoSync()
  tipPos.value = computeTipPosition(
    currentRect.value, { width: 280, height: 120 },
    currentStep.value.placement ?? 'auto',
    { width: sys.windowWidth, height: sys.windowHeight,
      statusBarHeight: sys.statusBarHeight ?? 0,
      safeBottom: (sys as any).safeAreaInsets?.bottom ?? 0 },
  )
})

const visible = computed(() => !!currentStep.value && !!currentRect.value)
</script>
```

> **uniapp gotcha:** uniapp H5 strips App.vue's template (replaced by `<uni-app><uni-page>`). For H5 use `<Teleport to="body">` (above). For mini-program targets, mount `<GuideRoot />` inside each page's template instead.

## Custom tip card via slot

```vue
<GuideMask :visible="true" :hole="..." :tipPosition="...">
  <template #tip="{ title, content, button, progressText, next }">
    <MyCard :title="title" :body="content" @click="next" />
  </template>
</GuideMask>
```
