<template>
  <view class="page">
    <view class="card" :data-guide-target="'card-4'">Page 3 first card</view>
    <view class="card" :data-guide-target="'card-5'">Page 3 second card</view>
    <GuideRoot />
  </view>
</template>
<script setup lang="ts">
import GuideRoot from '../../components/GuideRoot.vue'
</script>
<style>.page { padding: 16px; } .card { background:#d4edda; padding:16px; border-radius:8px; margin-bottom:12px; }</style>
