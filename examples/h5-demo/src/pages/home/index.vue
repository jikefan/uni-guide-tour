<template>
  <view class="page">
    <view
      v-guide-target="'card-1'"
      class="card"
    >
      Home Card 1 (match probability)
    </view>
    <view
      v-guide-target="'card-2'"
      class="card"
    >
      Home Card 2 (cancel rules)
    </view>
    <button @click="onStart">
      Start tour
    </button>
    <button
      style="margin-left: 8px;"
      @click="onForce"
    >
      Restart (force)
    </button>
    <button
      style="margin-left: 8px;"
      @click="onDelayed"
    >
      Start delayed
    </button>
    <button
      style="margin-left: 8px;"
      @click="onMissing"
    >
      Start missing
    </button>
    <button
      style="margin-left: 8px;"
      @click="onScroll"
    >
      Start scroll
    </button>
    <template v-if="showScrollContent">
      <view
        v-for="i in 30"
        :key="i"
        class="filler"
      >
        filler {{ i }}
      </view>
      <view
        v-guide-target="'card-bottom'"
        class="card"
      >
        Bottom card (off-screen)
      </view>
    </template>
    <GuideRoot />
  </view>
</template>
<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useGuide } from 'uni-guide-tour'
import GuideRoot from '../../components/GuideRoot.vue'
import scrollTour from '../../tours/scroll'
const guide = useGuide()
void scrollTour
const showScrollContent = ref(false)
// uniapp H5 shows the entry page at "/#/" by default; tests assert the explicit
// "/pages/home/..." path. Force the hash before starting so cross-page nav has a
// known starting URL.
const ensurePath = () => {
  if (location.hash === '' || location.hash === '#/') {
    location.hash = '/pages/home/index'
  }
}
const onStart = () => { ensurePath(); guide.start('demo') }
const onForce = () => { ensurePath(); guide.start('demo', { force: true }) }
const onDelayed = () => { ensurePath(); guide.start('delayed', { force: true }) }
const onMissing = () => { ensurePath(); guide.start('missing', { force: true }) }
const onScroll = async () => {
  ensurePath()
  showScrollContent.value = true
  await nextTick()
  // Reset scroll so target is genuinely off-screen, forcing engine to auto-scroll.
  window.scrollTo(0, 0)
  guide.start('scroll', { force: true })
}
</script>
<style>.page { padding: 16px; } .card { background:#f7f7f7; padding:16px; border-radius:8px; margin-bottom:12px; } .filler { padding: 8px; }</style>
