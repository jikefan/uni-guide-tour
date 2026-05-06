<template>
  <view class="page">
    <view
      v-if="ready"
      v-guide-target="'card-3'"
      class="card"
    >
      Page 2 main card
    </view>
    <GuideRoot />
  </view>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import GuideRoot from '../../components/GuideRoot.vue'
const ready = ref(false)
onLoad((q: any) => {
  const ms = parseInt(q?.delay ?? '0', 10) || 0
  if (!ms) { ready.value = true; return }
  setTimeout(() => { ready.value = true }, ms)
})
</script>
<style>.page { padding: 16px; } .card { background:#fff3cd; padding:16px; border-radius:8px; }</style>
