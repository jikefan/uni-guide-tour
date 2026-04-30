<template>
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
