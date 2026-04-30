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
      @next="onNext"
    />
  </Teleport>
</template>
<script setup lang="ts">
import { ref, watch, computed, inject, onMounted, onBeforeUnmount } from 'vue'
import { GuideKey, GuideMask, computeTipPosition } from 'uni-guide-tour'

// Use GuideKey directly so we can read engine.currentTour + store.currentStepIndex
// reactively. (The default useGuide().currentStep is a computed over a non-reactive
// engine.currentTour and never re-evaluates after mount on H5.)
const ctx = inject(GuideKey)!
const { engine, currentRect } = ctx
const store = engine.store

// Singleton claim: only the most-recently-mounted GuideRoot renders. On uniapp H5
// pages can stay alive (keep-alive) so multiple GuideRoot instances coexist; without
// this, every page's mask would render in parallel, producing duplicate elements.
const owner = ((): { id: number; current: any } => {
  const win = globalThis as any
  if (!win.__UGT_OWNER__) win.__UGT_OWNER__ = { id: 0, current: ref(0) }
  return win.__UGT_OWNER__
})()
const myId = ++owner.id
const isOwner = computed(() => owner.current.value === myId)
onMounted(() => { owner.current.value = myId })
onBeforeUnmount(() => { if (owner.current.value === myId) owner.current.value = 0 })

const currentStep = computed(() => {
  if (store.status !== 'running' && store.status !== 'paused' && store.status !== 'awaiting-route') return null
  const tour = engine.currentTour
  if (!tour) return null
  const idx = store.currentStepIndex
  if (idx < 0 || idx >= tour.steps.length) return null
  return tour.steps[idx]
})

const progress = computed(() => {
  const total = engine.currentTour?.steps.length ?? 0
  const current = store.currentStepIndex + 1
  return { current, total, percent: total ? current / total : 0 }
})

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

const onNext = () => engine.next()
</script>
