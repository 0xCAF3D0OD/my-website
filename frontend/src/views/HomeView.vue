<script setup lang="ts">
import { ref } from 'vue'
import LoginScreen from '../desktop/LoginScreen.vue'
import XpDesktop from '../desktop/XpDesktop.vue'

const booted = ref(false)
</script>

<template>
  <XpDesktop v-if="booted" @logoff="booted = false" />
  <LoginScreen v-else @done="booted = true" />
</template>
