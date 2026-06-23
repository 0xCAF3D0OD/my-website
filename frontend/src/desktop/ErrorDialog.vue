<script setup lang="ts">
import { computed } from 'vue'

// Popup d'erreur façon XP (« Application not found »), reproduit du composant
// ErrorBox de la référence : icône d'erreur + message multi-lignes + bouton OK.
const props = defineProps<{ message: string }>()
const emit = defineEmits<{ close: [] }>()

const lines = computed(() => props.message.split('\n'))
</script>

<template>
  <div class="error-overlay" @pointerdown.self="emit('close')">
    <div class="window error-win" @pointerdown.stop>
      <div class="title-bar">
        <div class="title-bar-text">
          <img src="/xp/windowsIcons/897(16x16).png" alt="" />
          <span>C:\</span>
        </div>
        <div class="title-bar-controls">
          <button aria-label="Close" @click="emit('close')"></button>
        </div>
      </div>
      <div class="window-body error-body">
        <div class="error-top">
          <img class="error-img" src="/xp/windowsIcons/897(32x32).png" alt="error" />
          <div class="error-messages">
            <p v-for="(line, i) in lines" :key="i" class="error-message">{{ line }}</p>
          </div>
        </div>
        <div class="error-bottom">
          <button class="error-button" @click="emit('close')">OK</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.error-overlay {
  position: absolute;
  inset: 0;
  z-index: 20000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.error-win {
  width: 360px;
  font-family: Tahoma, 'Noto Sans', sans-serif;
}
.title-bar-text img {
  width: 14px;
  height: 14px;
  margin-right: 4px;
  vertical-align: middle;
}
.error-body {
  background: #f5f5f5;
  font-size: 11px;
  padding: 14px 12px 12px;
  display: flex;
  flex-direction: column;
}
.error-top {
  display: flex;
  align-items: flex-start;
}
.error-img {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}
.error-messages {
  padding: 2px 12px 14px 16px;
}
.error-message {
  margin: 0;
  line-height: 16px;
  color: #111;
}
.error-bottom {
  display: flex;
  justify-content: center;
}
.error-button {
  min-width: 80px;
  height: 22px;
  font-size: 11px;
  padding: 0 10px;
}
</style>
