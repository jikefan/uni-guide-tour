<template>
  <Teleport to="body">
    <GuideMask
      v-if="visible"
      :visible="true"
      :hole="{ ...currentRect!, radius: 8 }"
      :tip-position="tipPos"
      :title="currentStep!.title"
      :content="currentStep!.content"
      :button="currentStep!.button"
      :progress-text="`${progress.current}/${progress.total}`"
      @next="next"
    />
  </Teleport>
</template>
<script setup lang="ts">
import { ref, watch, computed, onMounted, onBeforeUnmount } from 'vue'
import { useGuide, GuideMask, computeTipPosition } from 'uni-guide-tour'

const { currentStep, progress, next, currentRect } = useGuide()

// Singleton claim: only the most-recently-mounted GuideRoot renders. On uniapp H5
// pages can stay alive (keep-alive) so multiple GuideRoot instances coexist; without
// this, every page's mask would render in parallel, producing duplicate elements.
const owner = ((): { id: number; current: any } => {
  // eslint-disable-next-line no-undef
  const win = globalThis as any
  if (!win.__UGT_OWNER__) win.__UGT_OWNER__ = { id: 0, current: ref(0) }
  return win.__UGT_OWNER__
})()
const myId = ++owner.id
const isOwner = computed(() => owner.current.value === myId)
onMounted(() => { owner.current.value = myId })
onBeforeUnmount(() => { if (owner.current.value === myId) owner.current.value = 0 })

const tipPos = ref({ top: 0, left: 0 })

watch([currentStep, currentRect], () => {
  if (!currentStep.value || !currentRect.value) return
  const screen = { width: window.innerWidth, height: window.innerHeight, statusBarHeight: 0, safeBottom: 0 }
  tipPos.value = computeTipPosition(
    currentRect.value, { width: 280, height: 120 },
    currentStep.value.placement ?? 'auto', screen,
  )
})

const visible = computed(() => isOwner.value && !!currentStep.value && !!currentRect.value)
</script>
