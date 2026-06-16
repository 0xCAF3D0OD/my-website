<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { apps, type AppDef } from './registry'
import { useWindows } from './useWindows'
import { startFlag } from './icons'
import XpWindow from './XpWindow.vue'

const { windows, open, taskbarToggle } = useWindows()

const selected = ref<string | null>(null)
const startOpen = ref(false)
const clock = ref('')

function openApp(app: AppDef) {
  open(app)
  startOpen.value = false
}

function tick() {
  clock.value = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}
let timer: number
onMounted(() => {
  tick()
  timer = window.setInterval(tick, 1000 * 20)
  // Ouvre le terminal au démarrage pour donner le ton.
  const term = apps.find((a) => a.id === 'terminal')
  if (term) open(term)
})
onBeforeUnmount(() => clearInterval(timer))

function onDesktopClick() {
  selected.value = null
  startOpen.value = false
}
</script>

<template>
  <div class="desktop" @pointerdown.self="onDesktopClick">
    <div class="area">
      <!-- Icônes du bureau -->
      <div class="icons">
        <button
          v-for="app in apps"
          :key="app.id"
          class="desk-icon"
          :class="{ selected: selected === app.id }"
          @pointerdown.stop="selected = app.id"
          @dblclick="openApp(app)"
        >
          <img class="glyph" :src="app.icon" alt="" />
          <span class="label">{{ app.label }}</span>
        </button>
      </div>

      <!-- Fenêtres -->
      <XpWindow v-for="win in windows" :key="win.id" :win="win" />
    </div>

    <!-- Menu Démarrer -->
    <div v-if="startOpen" class="start-menu" @pointerdown.stop>
      <div class="start-head">
        <span class="avatar" v-html="startFlag"></span>
        <span>kevin</span>
      </div>
      <div class="start-list">
        <button v-for="app in apps" :key="app.id" class="start-item" @click="openApp(app)">
          <img class="mini" :src="app.icon" alt="" />
          <span>{{ app.label }}</span>
        </button>
      </div>
    </div>

    <!-- Barre des tâches -->
    <div class="taskbar">
      <button class="start-btn" :class="{ active: startOpen }" @pointerdown.stop="startOpen = !startOpen">
        <span class="flag" v-html="startFlag"></span>
        <span class="word">démarrer</span>
      </button>
      <div class="tasks">
        <button
          v-for="win in windows"
          :key="win.id"
          class="task"
          :class="{ active: !win.minimized }"
          @click="taskbarToggle(win)"
        >
          <img class="mini" :src="win.icon" alt="" />
          <span class="task-label">{{ win.title }}</span>
        </button>
      </div>
      <div class="tray">{{ clock }}</div>
    </div>
  </div>
</template>

<style scoped>
.desktop {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  font-family: Tahoma, Geneva, Verdana, sans-serif;
  background: #3a6ea5 url('/xp/bliss.jpg') center / cover no-repeat;
}
.area {
  position: absolute;
  inset: 0 0 34px 0;
  overflow: hidden;
}

.icons {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 4px;
  padding: 8px;
  height: 100%;
  width: 100%;
  pointer-events: none;
}
.desk-icon {
  pointer-events: auto;
  width: 84px;
  background: transparent;
  border: 1px dotted transparent;
  padding: 6px 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: default;
  color: #fff;
}
.desk-icon.selected {
  background: rgba(49, 106, 197, 0.4);
  border: 1px dotted #cfe0ff;
}
.glyph {
  width: 38px;
  height: 38px;
  display: inline-flex;
  filter: drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.4));
}
.flag :deep(svg),
.avatar :deep(svg) {
  width: 100%;
  height: 100%;
}
.glyph,
.mini {
  object-fit: contain;
}
.desk-icon .label {
  font-size: 11px;
  text-align: center;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  line-height: 1.2;
}

.taskbar {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 34px;
  display: flex;
  align-items: stretch;
  background: linear-gradient(to bottom, #3168d5 0%, #4993e6 9%, #2b6ad6 18%, #2360d4 90%, #1941a5 100%);
  border-top: 1px solid #0f3da6;
  z-index: 9999;
}
.start-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 18px 2px 10px;
  border: none;
  cursor: pointer;
  font-style: italic;
  font-weight: bold;
  font-size: 15px;
  color: #fff;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.4);
  background: linear-gradient(to bottom, #5eac56 0%, #3c8f37 50%, #287d23 51%, #379b32 100%);
  border-radius: 0 9px 9px 0;
}
.start-btn.active,
.start-btn:hover {
  filter: brightness(1.08);
}
.flag {
  width: 20px;
  height: 20px;
  display: inline-flex;
}
.tasks {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 3px 4px;
  overflow: hidden;
}
.task {
  display: flex;
  align-items: center;
  gap: 6px;
  max-width: 160px;
  height: 100%;
  padding: 0 8px;
  border: 1px solid #1b50bb;
  border-radius: 3px;
  background: linear-gradient(to bottom, #4d97f0, #2c6fdb);
  color: #fff;
  font-size: 12px;
  cursor: pointer;
}
.task.active {
  background: linear-gradient(to bottom, #1e54b7, #2d77e0);
  box-shadow: inset 1px 1px 3px rgba(0, 0, 0, 0.45);
}
.task .mini {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}
.task-label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tray {
  display: flex;
  align-items: center;
  padding: 0 12px;
  background: linear-gradient(to bottom, #138eca, #14a2e0 50%, #0f86c6);
  border-left: 1px solid #0f3da6;
  color: #fff;
  font-size: 12px;
}

.start-menu {
  position: absolute;
  left: 0;
  bottom: 34px;
  width: 240px;
  background: #fff;
  border: 1px solid #0831d9;
  border-bottom: none;
  border-radius: 8px 8px 0 0;
  overflow: hidden;
  z-index: 10000;
  box-shadow: 3px -3px 12px rgba(0, 0, 0, 0.4);
}
.start-head {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: linear-gradient(to bottom, #1f60d8, #2f7ae6);
  color: #fff;
  font-size: 14px;
  font-weight: bold;
}
.avatar {
  width: 30px;
  height: 30px;
  display: inline-flex;
  background: #fff;
  border-radius: 4px;
  padding: 3px;
}
.start-list {
  padding: 6px;
}
.start-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 7px 10px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 13px;
  color: #111;
  border-radius: 3px;
  text-align: left;
}
.start-item:hover {
  background: #2f7ae6;
  color: #fff;
}
.start-item .mini {
  width: 22px;
  height: 22px;
}
</style>
