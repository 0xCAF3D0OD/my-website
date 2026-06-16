<script setup lang="ts">
import { computed } from 'vue'
import { useWindows, type WinState } from './useWindows'

const props = defineProps<{ win: WinState }>()
const { focus, close, minimize, toggleMaximize } = useWindows()

const style = computed(() => {
  if (props.win.maximized) return { zIndex: props.win.z }
  return {
    left: props.win.x + 'px',
    top: props.win.y + 'px',
    width: props.win.w + 'px',
    height: props.win.h + 'px',
    zIndex: props.win.z,
  }
})

let startX = 0
let startY = 0
let originX = 0
let originY = 0

function onMove(e: PointerEvent) {
  props.win.x = originX + (e.clientX - startX)
  props.win.y = Math.max(0, originY + (e.clientY - startY))
}
function onUp() {
  window.removeEventListener('pointermove', onMove)
  window.removeEventListener('pointerup', onUp)
}
function startDrag(e: PointerEvent) {
  if (props.win.maximized) return
  focus(props.win)
  startX = e.clientX
  startY = e.clientY
  originX = props.win.x
  originY = props.win.y
  window.addEventListener('pointermove', onMove)
  window.addEventListener('pointerup', onUp)
}
</script>

<template>
  <div
    v-show="!win.minimized"
    class="xp-window"
    :class="{ maximized: win.maximized }"
    :style="style"
    @pointerdown="focus(win)"
  >
    <div class="title-bar" @pointerdown="startDrag" @dblclick="toggleMaximize(win)">
      <span class="title-icon" v-html="win.icon"></span>
      <span class="title-text">{{ win.title }}</span>
      <div class="title-buttons">
        <button class="tb min" aria-label="Réduire" @click.stop="minimize(win)">
          <svg viewBox="0 0 10 10"><rect x="2" y="7" width="6" height="1.6" /></svg>
        </button>
        <button class="tb max" aria-label="Agrandir" @click.stop="toggleMaximize(win)">
          <svg viewBox="0 0 10 10"><rect x="2" y="2" width="6" height="6" fill="none" stroke-width="1.4" /></svg>
        </button>
        <button class="tb close" aria-label="Fermer" @click.stop="close(win)">
          <svg viewBox="0 0 10 10"><path d="M2 2l6 6M8 2l-6 6" stroke-width="1.6" /></svg>
        </button>
      </div>
    </div>
    <div class="window-body">
      <component :is="win.component" />
    </div>
  </div>
</template>

<style scoped>
.xp-window {
  position: absolute;
  display: flex;
  flex-direction: column;
  background: #ece9d8;
  border: 1px solid #0831d9;
  border-top: none;
  border-radius: 8px 8px 0 0;
  box-shadow: 3px 3px 12px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  min-width: 260px;
}
.xp-window.maximized {
  inset: 0;
  width: auto !important;
  height: auto !important;
  border-radius: 0;
}

.title-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 28px;
  padding: 0 4px 0 6px;
  background: linear-gradient(to bottom, #0058ee 0%, #3f8cf3 8%, #0a59ef 40%, #0a59ef 88%, #0848c8 100%);
  color: #fff;
  cursor: default;
  user-select: none;
  flex-shrink: 0;
}
.title-icon {
  width: 16px;
  height: 16px;
  display: inline-flex;
}
.title-icon :deep(svg) {
  width: 100%;
  height: 100%;
}
.title-text {
  flex: 1;
  font-size: 12px;
  font-weight: bold;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.title-buttons {
  display: flex;
  gap: 2px;
}
.tb {
  width: 21px;
  height: 21px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #fff;
  border-radius: 3px;
  background: linear-gradient(to bottom, #4a8ef0, #1c5fd6);
  cursor: pointer;
}
.tb svg {
  width: 10px;
  height: 10px;
  fill: #fff;
  stroke: #fff;
}
.tb:hover {
  filter: brightness(1.15);
}
.tb.close {
  background: linear-gradient(to bottom, #e9866b, #c5391b);
}

.window-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #fff;
  border: 2px solid #0831d9;
  border-top: none;
}
.window-body > :deep(*) {
  flex: 1;
  min-height: 0;
}
</style>
