<script setup lang="ts">
import { inject } from 'vue'
import { games } from '../../games/registry'
import type { GameDef } from '../../games/types'

// Fourni par le bureau : ouvre une fenêtre à partir d'une définition d'app.
const openWindow = inject<(def: AppLike) => void>('openWindow', () => {})

interface AppLike {
  id: string
  title: string
  icon: string
  component: unknown
  w: number
  h: number
}

function launch(g: GameDef) {
  openWindow({
    id: 'game-' + g.id,
    title: g.name,
    icon: g.icon || '/xp/icons/games.svg',
    component: g.component,
    w: g.w || 520,
    h: g.h || 440,
  })
}
</script>

<template>
  <div class="games">
    <div class="addressbar">
      <span class="lbl">Adresse</span>
      <div class="path"><img src="/xp/icons/games.svg" class="mini" alt="" /> C:\kevin\jeux</div>
    </div>
    <div class="grid">
      <button v-for="g in games" :key="g.id" class="game" @dblclick="launch(g)" @click="launch(g)">
        <img class="ico" :src="g.icon || '/xp/icons/games.svg'" alt="" />
        <span class="name">{{ g.name }}</span>
      </button>
    </div>
    <div class="statusbar">{{ games.length }} jeu(x) · double-clique pour jouer</div>
  </div>
</template>

<style scoped>
.games {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
  font-family: Tahoma, sans-serif;
}
.addressbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-bottom: 1px solid #d6d3ce;
  background: #f1efe7;
  flex-shrink: 0;
}
.addressbar .lbl {
  font-size: 12px;
  color: #555;
}
.path {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  background: #fff;
  border: 1px solid #9aa0a6;
  padding: 2px 6px;
  font-size: 12px;
}
.mini {
  width: 14px;
  height: 14px;
}
.grid {
  flex: 1;
  overflow: auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, 84px);
  align-content: flex-start;
  gap: 6px;
  padding: 12px;
}
.game {
  width: 84px;
  border: 1px dotted transparent;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 6px 4px;
  cursor: pointer;
}
.game:hover {
  background: #e8f0fe;
  border-color: #b6c8e8;
}
.ico {
  width: 40px;
  height: 40px;
  object-fit: contain;
}
.name {
  font-size: 12px;
  color: #111;
  text-align: center;
}
.statusbar {
  border-top: 1px solid #d6d3ce;
  background: #f1efe7;
  padding: 3px 8px;
  font-size: 11px;
  color: #555;
  flex-shrink: 0;
}
</style>
