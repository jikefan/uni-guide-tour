<script setup lang="ts">
import { onMounted } from 'vue'
import { useGuide } from 'uni-guide-tour'
import demoTour from './tours/demo'

const guide = useGuide()
onMounted(async () => {
  await guide.register(demoTour)
})
</script>
<template><view /></template>
