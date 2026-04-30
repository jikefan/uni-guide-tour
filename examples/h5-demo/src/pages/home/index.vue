<template>
  <view class="page">
    <view class="card" id="target-1">Card #1: Match probability</view>
    <view class="card" id="target-2">Card #2: Cancel rules</view>
    <button @click="showMask = true">Start mock tour</button>

    <GuideMask
      v-if="showMask"
      :visible="true"
      :hole="hole"
      :tipPosition="tipPos"
      title="Hello"
      content="This is a sample mask"
      button="Got it"
      progressText="1/3"
      @next="showMask = false"
    />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { GuideMask } from 'uni-guide-tour'

const showMask = ref(false)
const hole = { top: 80, left: 16, width: 343, height: 60, radius: 8 }
const tipPos = { top: 160, left: 16 }
</script>

<style>
.page { padding: 16px; }
.card { background:#f7f7f7; padding:16px; border-radius:8px; margin-bottom:12px; }
</style>
