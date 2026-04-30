<template>
  <view class="page">
    <view class="card" v-guide-target="'card-1'">Home Card 1</view>
    <view class="card" v-guide-target="'card-2'">Home Card 2</view>
    <button @click="onStart">Start tour</button>
    <button @click="onForce" style="margin-left: 8px;">Restart (force)</button>
    <GuideRoot />
  </view>
</template>
<script setup lang="ts">
import { useGuide } from 'uni-guide-tour'
import GuideRoot from '../../components/GuideRoot.vue'
const guide = useGuide()
const onStart = () => guide.start('demo')
const onForce = () => guide.start('demo', { force: true })
</script>
<style>.page { padding: 16px; } .card { background:#f7f7f7; padding:16px; border-radius:8px; margin-bottom:12px; }</style>
