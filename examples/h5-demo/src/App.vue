<template><view /></template>
<script setup lang="ts">
import { useGuide } from 'uni-guide-tour'
import demoTour from './tours/demo'
const guide = useGuide()
// Register at app root so hydrate runs regardless of which page the user lands on
// (e.g., direct reload on /pages/page2 — without this, register would only fire on
// home page setup and resume would never trigger).
guide.register(demoTour)
</script>
