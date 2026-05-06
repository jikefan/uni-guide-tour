<template>
  <view class="page">
    <view
      v-guide-target="'card-4'"
      class="card"
    >
      Page 3 first card
    </view>
    <view
      v-guide-target="'card-5'"
      class="card"
    >
      Page 3 second card
    </view>
    <GuideRoot />
  </view>
</template>
<script setup lang="ts">
import GuideRoot from '../../components/GuideRoot.vue'
</script>
<style>.page { padding: 16px; } .card { background:#d4edda; padding:16px; border-radius:8px; margin-bottom:12px; }</style>
