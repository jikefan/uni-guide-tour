<template>
  <view class="page">
    <view class="card" v-guide-target="'card-1'">Home Card 1 (match probability)</view>
    <view class="card" v-guide-target="'card-2'">Home Card 2 (cancel rules)</view>
    <button @click="onStart">Start tour</button>
    <button @click="onForce" style="margin-left: 8px;">Restart (force)</button>
    <GuideRoot />
  </view>
</template>
<script setup lang="ts">
import { useGuide } from 'uni-guide-tour'
import GuideRoot from '../../components/GuideRoot.vue'
const guide = useGuide()
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
</script>
<style>.page { padding: 16px; } .card { background:#f7f7f7; padding:16px; border-radius:8px; margin-bottom:12px; }</style>
