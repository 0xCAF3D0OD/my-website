<script setup lang="ts">
import { ref } from 'vue'
import BootSequence from '../desktop/BootSequence.vue'
import XpDesktop from '../desktop/XpDesktop.vue'

const booted = ref(false)
</script>

<template>
  <XpDesktop v-if="booted" />
  <BootSequence v-else @done="booted = true" />
</template>
