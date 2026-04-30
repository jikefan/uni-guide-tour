<template>
  <view class="page">
    <view class="card" :data-guide-target="'card-3'">Page 2 main card</view>
    <GuideRoot />
  </view>
</template>
<script setup lang="ts">
import GuideRoot from '../../components/GuideRoot.vue'
</script>
<style>.page { padding: 16px; } .card { background:#fff3cd; padding:16px; border-radius:8px; }</style>
