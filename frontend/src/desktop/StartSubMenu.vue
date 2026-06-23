<script setup lang="ts">
import { ref } from 'vue'
import type { StartMenuEntry } from './startMenuData'

// Sous-menu en cascade (récursif) façon « Tous les programmes » de XP.
// Chaque entrée de type `menu` ouvre son propre sous-menu au survol.
defineProps<{ entries: StartMenuEntry[] }>()
const emit = defineEmits<{ pick: [string | null] }>()

const openIdx = ref(-1)
</script>

<template>
  <div class="ssm">
    <template v-for="(e, i) in entries" :key="i">
      <div v-if="e.type === 'separator'" class="ssm-sep"></div>

      <div
        v-else-if="e.type === 'item'"
        class="ssm-item"
        @mouseenter="openIdx = -1"
        @click="emit('pick', e.app ?? null)"
      >
        <img :src="e.icon" alt="" />
        <span class="ssm-text">{{ e.label }}</span>
      </div>

      <div
        v-else
        class="ssm-item has-sub"
        :class="{ open: openIdx === i }"
        @mouseenter="openIdx = i"
      >
        <img :src="e.icon" alt="" />
        <span class="ssm-text">{{ e.label }}</span>
        <i class="ssm-arrow"></i>
        <!-- Récursion : un menu imbriqué s'ouvre à droite, aligné en bas. -->
        <StartSubMenu
          v-if="openIdx === i"
          class="ssm-nested"
          :entries="e.items"
          @pick="emit('pick', $event)"
        />
      </div>
    </template>
  </div>
</template>

<style scoped>
.ssm {
  background: #fff;
  padding-left: 1px;
  box-shadow:
    inset 0 0 0 1px #72ade9,
    2px 3px 3px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
}
.ssm-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  height: 25px;
  padding: 0 22px 0 10px;
  box-shadow: inset 3px 0 #4081ff;
  color: #000;
  font-size: 11px;
  white-space: nowrap;
  cursor: pointer;
}
.ssm-item:hover,
.ssm-item.open {
  background: #1b65cc;
  color: #fff;
}
.ssm-item img {
  width: 16px;
  height: 16px;
  object-fit: contain;
}
.ssm-text {
  font-size: 11px;
}
.ssm-arrow {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border: 4px solid transparent;
  border-right: 0;
  border-left-color: #000;
}
.ssm-item:hover .ssm-arrow,
.ssm-item.open .ssm-arrow {
  border-left-color: #fff;
}
.ssm-nested {
  position: absolute;
  z-index: 1;
  left: 100%;
  bottom: -1px;
}
.ssm-sep {
  height: 2px;
  margin: 1px 5px;
  box-shadow: inset 3px 0 #4081ff;
  background: linear-gradient(
    to right,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.1) 50%,
    rgba(0, 0, 0, 0) 100%
  );
}
</style>
