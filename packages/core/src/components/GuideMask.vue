<template>
  <view v-if="visible" class="ugt-root" @touchmove.stop.prevent>
    <view
      class="ugt-hole"
      :style="{
        top: hole.top + 'px',
        left: hole.left + 'px',
        width: hole.width + 'px',
        height: hole.height + 'px',
        borderRadius: (hole.radius ?? 8) + 'px',
      }"
    />
    <view
      class="ugt-tip"
      :style="{ top: tipPosition.top + 'px', left: tipPosition.left + 'px' }"
    >
      <slot name="tip" :title="title" :content="content"
            :button="button" :progressText="progressText" :next="emitNext">
        <view class="ugt-tip__title">{{ resolve(title) }}</view>
        <view class="ugt-tip__content">{{ resolve(content) }}</view>
        <view class="ugt-tip__footer">
          <text class="ugt-tip__progress">{{ progressText }}</text>
          <button class="ugt-tip__next" @click="emitNext">{{ resolve(button) }}</button>
        </view>
      </slot>
    </view>
  </view>
</template>

<script setup lang="ts">
import { isRef, type Ref } from 'vue'
import type { Rect, ContentSource } from '../types'

interface Props {
  visible: boolean
  hole: Rect & { radius?: number }
  tipPosition: { top: number; left: number }
  title: ContentSource
  content: ContentSource
  button: ContentSource
  progressText: string
}

defineProps<Props>()
const emit = defineEmits<{ next: [] }>()

function resolve(v: ContentSource): string {
  if (typeof v === 'string') return v
  if (typeof v === 'function') return v()
  if (isRef(v)) return (v as Ref<string>).value
  return String(v)
}
function emitNext() { emit('next') }
</script>

<style>
.ugt-root { position: fixed; inset: 0; z-index: 9999; pointer-events: auto; }
.ugt-hole {
  position: fixed;
  background: transparent;
  box-shadow: 0 0 0 9999px var(--guide-mask-bg, rgba(0,0,0,.6));
  transition: all .25s ease;
  pointer-events: none;
}
.ugt-tip {
  position: fixed;
  background: var(--guide-tip-bg, #fff);
  color: var(--guide-tip-color, #222);
  border-radius: var(--guide-tip-radius, 12px);
  padding: 16px;
  max-width: 320px;
  box-shadow: 0 4px 16px rgba(0,0,0,.12);
}
.ugt-tip__title { font-weight: 600; font-size: 16px; margin-bottom: 8px; }
.ugt-tip__content { font-size: 14px; line-height: 1.5; }
.ugt-tip__footer { display: flex; justify-content: space-between; align-items: center; margin-top: 12px; }
.ugt-tip__progress { font-size: 12px; opacity: .6; }
.ugt-tip__next {
  background: var(--guide-button-bg, #007aff);
  color: var(--guide-button-color, #fff);
  border: none; border-radius: 6px;
  padding: 6px 14px; font-size: 14px; cursor: pointer;
}
</style>
