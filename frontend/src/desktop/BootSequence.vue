<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'

const emit = defineEmits<{ done: [] }>()

type Phase = 'power' | 'boot' | 'welcome'
const phase = ref<Phase>('power')

let startup: HTMLAudioElement | null = null
let logon: HTMLAudioElement | null = null
const timers: number[] = []

function after(ms: number, fn: () => void) {
  timers.push(window.setTimeout(fn, ms))
}

// Le clic d'allumage fournit le geste utilisateur requis pour jouer l'audio.
function powerOn() {
  startup = new Audio('/xp/sounds/startup.wav')
  startup.play().catch(() => {})
  phase.value = 'boot'
  after(5200, () => {
    phase.value = 'welcome'
    logon = new Audio('/xp/sounds/logon.wav')
    logon.play().catch(() => {})
    after(2600, () => emit('done'))
  })
}

function skip() {
  startup?.pause()
  logon?.pause()
  emit('done')
}

onBeforeUnmount(() => timers.forEach(clearTimeout))
</script>

<template>
  <!-- Allumage -->
  <div v-if="phase === 'power'" class="screen power" @click="powerOn">
    <button class="power-btn" aria-label="Allumer">
      <svg viewBox="0 0 24 24"><path d="M12 3v9" /><path d="M7.5 6.5a7 7 0 1 0 9 0" /></svg>
    </button>
    <p class="hint">Cliquez pour allumer le PC</p>
  </div>

  <!-- Écran de démarrage -->
  <div v-else-if="phase === 'boot'" class="screen boot">
    <div class="logo">
      <span class="flag">
        <i style="background: #f25022"></i><i style="background: #7fba00"></i>
        <i style="background: #00a4ef"></i><i style="background: #ffb900"></i>
      </span>
      <span class="brand">
        <small>Microsoft<sup>®</sup></small>
        <b>Windows<span class="xp">xp</span></b>
      </span>
    </div>
    <div class="progress"><span></span></div>
    <button class="skip" @click="skip">passer</button>
  </div>

  <!-- Bienvenue -->
  <div v-else class="screen welcome" @click="skip">
    <div class="welcome-bar top"></div>
    <p class="welcome-text">Bienvenue</p>
    <div class="welcome-bar bottom"></div>
  </div>
</template>

<style scoped>
.screen {
  position: fixed;
  inset: 0;
  z-index: 100000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: Tahoma, Geneva, Verdana, sans-serif;
  user-select: none;
}

/* Allumage */
.power {
  background: #000;
  cursor: pointer;
  gap: 24px;
}
.power-btn {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  background: #0a0a0a;
  border: 2px solid #2a6fd6;
  color: #4aa3ff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 22px rgba(58, 140, 243, 0.5);
  animation: pulse 2s ease-in-out infinite;
}
.power-btn svg {
  width: 38px;
  height: 38px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
}
.hint {
  color: #7d7d7d;
  font-size: 13px;
}
@keyframes pulse {
  50% {
    box-shadow: 0 0 34px rgba(58, 140, 243, 0.9);
  }
}

/* Boot */
.boot {
  background: #000;
  gap: 46px;
}
.logo {
  display: flex;
  align-items: center;
  gap: 14px;
}
.flag {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px;
  width: 38px;
  height: 38px;
  transform: perspective(120px) rotateY(-18deg);
}
.flag i {
  display: block;
  border-radius: 2px;
}
.brand {
  display: flex;
  flex-direction: column;
  line-height: 1;
  color: #fff;
}
.brand small {
  font-size: 11px;
  color: #d9d9d9;
  margin-bottom: 2px;
}
.brand small sup {
  font-size: 7px;
}
.brand b {
  font-size: 34px;
  font-weight: 400;
  letter-spacing: 0.5px;
}
.brand .xp {
  color: #ff9f17;
  font-style: italic;
  font-weight: 700;
  margin-left: 4px;
}

.progress {
  width: 150px;
  height: 16px;
  border: 1px solid #5a5a5a;
  border-radius: 9px;
  overflow: hidden;
  position: relative;
}
.progress span {
  position: absolute;
  top: 2px;
  left: 0;
  height: 10px;
  width: 44px;
  border-radius: 6px;
  background: linear-gradient(to right, #1247a6, #3f8cf3, #1247a6);
  animation: slide 2.1s linear infinite;
}
@keyframes slide {
  0% {
    left: -46px;
  }
  100% {
    left: 150px;
  }
}
.skip {
  position: absolute;
  bottom: 22px;
  right: 22px;
  background: transparent;
  border: 1px solid #444;
  color: #777;
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 3px;
  cursor: pointer;
}

/* Bienvenue */
.welcome {
  background: linear-gradient(to bottom, #5a7edc 0%, #4264c4 45%, #2f4aa0 100%);
  cursor: pointer;
}
.welcome-bar {
  position: absolute;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(to right, transparent, #ff9f17, #fff, #ff9f17, transparent);
}
.welcome-bar.top {
  top: 30%;
}
.welcome-bar.bottom {
  bottom: 30%;
}
.welcome-text {
  color: #fff;
  font-size: 40px;
  font-weight: 300;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.4);
  animation: fadein 1s ease;
}
@keyframes fadein {
  from {
    opacity: 0;
  }
}
</style>
