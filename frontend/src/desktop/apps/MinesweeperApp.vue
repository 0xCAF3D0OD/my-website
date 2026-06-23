<script setup lang="ts">
import { ref, reactive, computed, inject, onMounted, onBeforeUnmount } from 'vue'
import type { WinState } from '../useWindows'

interface Cell {
  mine: boolean
  revealed: boolean
  flagged: boolean
  adj: number
  isTriggered?: boolean
}

const grid = reactive<Cell[][]>([])
const state = ref<'ready' | 'playing' | 'question' | 'won' | 'lost'>('ready')
const flags = ref(0)
const time = ref(0)
let timer: number | null = null
let placed = false

type Level = 'simple' | 'medium' | 'hard' | 'Legendary'
const level = ref<Level>('simple')
const menuOpen = ref(false)

// Dimensions courantes du plateau (réactives pour redimensionner la fenêtre).
const rows = ref(9)
const cols = ref(9)
const mines = ref(10)

// Configurations par difficulté + libellé affiché dans le menu.
const configs: Record<Level, { r: number; c: number; m: number; label: string }> = {
  simple: { r: 9, c: 9, m: 10, label: 'Débutant' },
  medium: { r: 16, c: 16, m: 40, label: 'Intermédiaire' },
  hard: { r: 16, c: 30, m: 99, label: 'Expert' },
  Legendary: { r: 24, c: 30, m: 160, label: 'Légendaire' },
}

// --- Auto-dimensionnement de la fenêtre au contenu (comme le winXP d'origine) ---
const win = inject<WinState | null>('win', null)
const innerEl = ref<HTMLElement | null>(null)

function fitWindow() {
  const inner = innerEl.value
  if (!win || !inner) return
  const body = inner.closest('.window-body') as HTMLElement | null
  if (!body) return
  // Différence entre la fenêtre (bordures + barre de titre) et la zone de contenu.
  const chromeW = win.w - body.clientWidth
  const chromeH = win.h - body.clientHeight
  win.w = inner.offsetWidth + chromeW
  win.h = inner.offsetHeight + chromeH
}

// On mesure après le recalcul de mise en page (rAF), avec une 2ᵉ passe pour
// converger : à la 1re passe la fenêtre déborde encore, ce qui fausserait le chrome.
function scheduleFit() {
  requestAnimationFrame(() => {
    fitWindow()
    requestAnimationFrame(fitWindow)
  })
}

function changeLevel(next: Level) {
  const config = configs[next]
  rows.value = config.r
  cols.value = config.c
  mines.value = config.m
  level.value = next
  menuOpen.value = false
  reset()
  scheduleFit()
}

function toggleMenu(event: MouseEvent) {
  event.stopPropagation()
  menuOpen.value = !menuOpen.value
}
function closeMenu() {
  menuOpen.value = false
}
function newGame() {
  menuOpen.value = false
  reset()
}
// --- Quiz « connais-tu Kevin ? » : posé UNIQUEMENT quand le joueur touche une mine.
// Bonne réponse = la mine est désamorcée et la partie continue. Mauvaise = game over.
const quiz = [
  {
    q: 'Quel projet a permis a Kevin de developper sa connaissance sur le monitoring grafana-prometheus ?',
    opts: ['Esp32-monitoring', 'monitor42', 'get-my-grafana'],
    a: 0,
  },
  {
    q: 'Quel est le nom du projet de stage que Kevin a fait durant son deuxième stage ?',
    opts: ['PortalSre', 'Portal', 'SREPortal'],
    a: 2,
  },
  {
    q: 'Quelle formation Kevin a-t-il suivie ?',
    opts: ['EPFL', 'Ecole42', 'Epitech'],
    a: 1,
  },
  {
    q: 'Chez quelle entreprise Kevin a-t-il fait son stage DevOps ?',
    opts: ['NAGRA Kudelski', 'Google', 'OVHcloud'],
    a: 0,
  },
  {
    q: 'Quel projet de Kevin tourne en production ?',
    opts: ['alloremplacant.ch', 'dkey.fr', 'example.com'],
    a: 0,
  },
  {
    q: 'Quel outil d’Infrastructure as Code Kevin utilise-t-il ?',
    opts: ['Photoshop', 'Terraform', 'Excel'],
    a: 1,
  },
  {
    q: 'Dans quel region Kevin peut il travailler ?',
    opts: ['Genève', 'Lausanne', 'Partout'],
    a: 2,
  },
  {
    q: 'Quel orchestrateur de conteneurs Kevin maîtrise-t-il ?',
    opts: ['Kubernetes', 'WordPress', 'MySQL'],
    a: 0,
  },
]
const qIndex = ref(0)
let pending: { r: number; c: number } | null = null

function askQuestion(r: number, c: number) {
  pending = { r, c }
  qIndex.value = Math.floor(Math.random() * quiz.length)
  state.value = 'question'
  if (timer) clearInterval(timer) // on met le chrono en pause
  timer = null
}

function answer(i: number) {
  if (state.value !== 'question' || !pending) return
  if (i === quiz[qIndex.value]!.a) {
    // Bonne réponse : on désamorce la mine et on reprend la partie.
    const cell = grid[pending.r]![pending.c]!
    cell.flagged = true
    flags.value++
    pending = null
    state.value = 'playing'
    startTimer()
    checkWin()
  } else {
    // Mauvaise réponse : game over (on révèle les mines maintenant).
    const cell = grid[pending.r]![pending.c]!
    cell.revealed = true
    lose(pending.r, pending.c)
    pending = null
  }
}

function blank(): Cell {
  return { mine: false, revealed: false, flagged: false, adj: 0 }
}

function reset() {
  grid.splice(0, grid.length)
  // Utilise rows.value et cols.value !
  for (let r = 0; r < rows.value; r++) {
    const row: Cell[] = []
    for (let c = 0; c < cols.value; c++) {
      row.push(blank())
    }
    grid.push(row)
  }
  state.value = 'ready'
  flags.value = 0
  time.value = 0
  placed = false
  if (timer) clearInterval(timer)
  timer = null
}

function startTimer() {
  timer = window.setInterval(() => {
    if (time.value < 999) time.value++
  }, 1000)
}

// 1. Utilisez vos variables réactives partout, PAS les anciennes constantes
function placeMines(safeR: number, safeC: number) {
  let toPlace = mines.value // Utilise la variable réactive
  while (toPlace > 0) {
    const r = Math.floor(Math.random() * rows.value) // Utilise rows.value
    const c = Math.floor(Math.random() * cols.value) // Utilise cols.value
    if (grid[r]![c]!.mine) continue
    if (Math.abs(r - safeR) <= 1 && Math.abs(c - safeC) <= 1) continue
    grid[r]![c]!.mine = true
    toPlace--
  }
  for (let r = 0; r < rows.value; r++) {
    for (let c = 0; c < cols.value; c++) {
      if (grid[r]![c]!.mine) continue
      grid[r]![c]!.adj = neighbors(r, c).filter(([nr, nc]) => grid[nr]![nc]!.mine).length
    }
  }
  placed = true
}

function neighbors(r: number, c: number): [number, number][] {
  const out: [number, number][] = []
  for (let dr = -1; dr <= 1; dr++)
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue
      const nr = r + dr
      const nc = c + dc
      // Utilise rows.value et cols.value ici aussi
      if (nr >= 0 && nr < rows.value && nc >= 0 && nc < cols.value) out.push([nr, nc])
    }
  return out
}
const minesLeft = computed(() => Math.max(0, mines.value - flags.value))

function reveal(r: number, c: number) {
  if (state.value !== 'ready' && state.value !== 'playing') return
  const cell = grid[r]![c]!
  if (cell.revealed || cell.flagged) return
  if (!placed) {
    placeMines(r, c)
    state.value = 'playing'
    startTimer()
  }
  if (cell.mine) {
    // On ne révèle pas les autres mines : on pose une question pour survivre.
    askQuestion(r, c)
    return
  }
  flood(r, c)
  checkWin()
}

function flood(r: number, c: number) {
  const cell = grid[r]![c]!
  if (cell.revealed || cell.flagged || cell.mine) return
  cell.revealed = true
  if (cell.adj === 0) neighbors(r, c).forEach(([nr, nc]) => flood(nr, nc))
}

function toggleFlag(r: number, c: number) {
  if (state.value !== 'playing' && state.value !== 'ready') return
  const cell = grid[r]![c]!
  if (cell.revealed) return
  cell.flagged = !cell.flagged
  flags.value += cell.flagged ? 1 : -1
}

function lose(r: number, c: number) {
  state.value = 'lost'
  if (timer) clearInterval(timer)

  // Marquer uniquement la mine touchée
  const triggeredMine = grid[r]![c]!
  triggeredMine.isTriggered = true
  for (const row of grid) for (const cell of row) if (cell.mine) cell.revealed = true
}

function checkWin() {
  let safeHidden = 0
  for (const row of grid) for (const cell of row) if (!cell.mine && !cell.revealed) safeHidden++
  if (safeHidden === 0) {
    state.value = 'won'
    if (timer) clearInterval(timer)
  }
}

const face = computed(() => {
  if (state.value === 'lost') return '/xp/minesweeper/dead.png'
  if (state.value === 'won') return '/xp/minesweeper/win.png'
  if (state.value === 'question') return '/xp/minesweeper/ohh.png'
  return '/xp/icons/smiley.svg' // État par défaut (ready / playing)
})
const pad = (n: number) => n.toString().padStart(3, '0')
const numColor = [
  '',
  '#0000ff',
  '#008000',
  '#ff0000',
  '#000080',
  '#800000',
  '#008080',
  '#000',
  '#808080',
]

reset()
onMounted(scheduleFit)
onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="ms" @contextmenu.prevent @click="closeMenu">
    <div class="ms__inner" ref="innerEl">
      <div class="ie__bar">
        <div class="ie__btn-wrapper">
          <div class="ie__btn" :class="{ active: menuOpen }" @click="toggleMenu">
            <span class="t">Jeu</span>
          </div>

          <div v-if="menuOpen" class="fav-menu" @click.stop>
            <button class="fav-item" @click="newGame">Nouvelle partie</button>
            <div class="fav-sep"></div>
            <button
              v-for="(cfg, key) in configs"
              :key="key"
              class="fav-item"
              @click="changeLevel(key as Level)"
            >
              <span class="fav-check">{{ level === key ? '✓' : '' }}</span>
              {{ cfg.label }}
            </button>
          </div>
        </div>
      </div>

      <div class="panel">
        <div class="led">{{ pad(minesLeft) }}</div>
        <button class="face" @click="reset">
          <img :src="face" alt="Expression du visage" class="smiley-img" />
        </button>
        <div class="led">{{ pad(time) }}</div>
      </div>
      <div class="board" :style="{ gridTemplateColumns: `repeat(${cols}, 22px)` }">
      <template v-for="(row, r) in grid" :key="r">
        <button
          v-for="(cell, c) in row"
          :key="r + '-' + c"
          class="cell"
          :class="{
            revealed: cell.revealed,
            triggered: cell.mine && cell.isTriggered, // Ajout de la classe conditionnelle
          }"
          @click="reveal(r, c)"
          @contextmenu.prevent="toggleFlag(r, c)"
        >
          <template v-if="state === 'lost' && cell.mine && cell.isTriggered">
            <img src="/xp/minesweeper/mine-death.png" alt="mine-death" />
          </template>

          <template v-else-if="state === 'lost' && cell.mine && !cell.flagged">
            <img src="/xp/minesweeper/mine-ceil.png" alt="mine" />
          </template>

          <template v-else-if="state === 'lost' && cell.mine && cell.flagged">
            <img src="/xp/minesweeper/misflagged.png" alt="misflagged" />
          </template>

          <template v-else-if="cell.revealed">
            <span v-if="cell.adj > 0" :style="{ color: numColor[cell.adj] }">
              {{ cell.adj }}
            </span>
          </template>

          <template v-else-if="cell.flagged">
            <img src="/xp/minesweeper/flag.png" alt="flag" />
          </template>
        </button>
      </template>
    </div>
    <p class="hint">
      <template v-if="state === 'lost'">
        <div class="result-container">
          Perdu ! Clique sur
          <img src="/xp/icons/smiley.svg" alt="Smiley" class="smiley-img" /> pour rejouer.
        </div>
      </template>
      <template v-else-if="state === 'won'">Gagné ! 😎</template>
      <template v-else>Clic gauche : révéler · Clic droit : drapeau</template>
    </p>
    </div>

    <!-- Question posée seulement quand on touche une mine (overlay sur le plateau) -->
    <div v-if="state === 'question'" class="quiz-overlay">
      <div class="quiz">
        <p class="qtitle">
          <img src="/xp/minesweeper/mine-ceil.png" alt="mine" />
          Mine ! Réponds pour survivre :
        </p>
        <p class="q">{{ quiz[qIndex]!.q }}</p>
        <div class="opts">
          <button v-for="(o, i) in quiz[qIndex]!.opts" :key="i" @click="answer(i)">
            {{ o }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ms {
  position: relative;
  height: 100%;
  background: #c0c0c0;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
  font-family: Tahoma, sans-serif;
  user-select: none;
}
/* Contenu mesuré pour dimensionner la fenêtre : largeur = celle du plateau. */
.ms__inner {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
  width: max-content;
}
.panel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 5px 8px;
  box-shadow:
    inset 2px 2px #808080,
    inset -2px -2px #fff;
  background: #c0c0c0;
}
.led {
  background: #000;
  color: #f00;
  font-family: 'Lucida Console', monospace;
  font-size: 22px;
  font-weight: bold;
  padding: 1px 5px;
  letter-spacing: 1px;
}
.face {
  width: 30px;
  height: 30px;
  font-size: 17px;
  border: none;
  background: #c0c0c0;
  box-shadow:
    inset -2px -2px #808080,
    inset 2px 2px #fff;
  cursor: pointer;
  display: flex; /* Ajouté pour centrer l'image/emoji */
  align-items: center; /* Ajouté */
  justify-content: center; /* Ajouté */
  padding: 0;
}
.face:active {
  box-shadow:
    inset 2px 2px #808080,
    inset -2px -2px #fff;
}
.result-container {
  display: flex;
  align-items: center; /* Aligne le texte et l'image au centre verticalement */
  gap: 5px; /* Espace optionnel entre le texte et l'icône */
}
.smiley-img {
  width: 20px;
  height: 20px;
  display: block;
}
.board {
  display: grid;
  gap: 0;
  box-shadow:
    inset 3px 3px #808080,
    inset -3px -3px #fff;
  padding: 3px;
  background: #c0c0c0;
}
.cell {
  width: 22px;
  height: 22px;
  font-size: 13px;
  font-weight: bold;
  line-height: 1;
  border: none;
  padding: 0;
  background: #c0c0c0;
  box-shadow:
    inset -2px -2px #808080,
    inset 2px 2px #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cell.revealed {
  box-shadow: inset 0 0 0 1px #808080;
  background: #bdbdbd;
  cursor: default;
}
.hint {
  font-size: 11px;
  color: #444;
  margin: 0;
  text-align: center;
}
.quiz-overlay {
  position: absolute;
  inset: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.35);
  padding: 12px;
}
.quiz {
  width: 100%;
  max-width: 230px;
  background: #ece9d8;
  border: 1px solid #0831d9;
  border-radius: 4px;
  box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.45);
  padding: 10px;
}
.qtitle {
  margin: 0 0 6px;
  font-size: 12px;
  font-weight: bold;
  color: #a32d2d;
}
.q {
  margin: 0 0 8px;
  font-size: 12px;
  color: #222;
}
.opts {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.opts button {
  font-size: 12px;
  padding: 4px 8px;
  text-align: left;
}

.ie__btn-wrapper {
  position: relative; /* Indispensable pour que le menu se cale sur le bouton */
  height: 100%;
  display: flex;
  align-items: center;
}

.fav-menu {
  position: absolute;
  top: 100%; /* Juste en dessous de la barre */
  left: 0;
  z-index: 100;
  background: #c0c0c0;
  border: 1px solid #808080;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
  padding: 2px;
  min-width: 150px;
}
.fav-item {
  display: flex;
  align-items: center;
  width: 100%;
  text-align: left;
  border: none;
  background: transparent;
  padding: 4px 8px;
  font-size: 12px;
  color: #1a1a1a;
  cursor: pointer;
}
.fav-item:hover {
  background: #316ac5;
  color: #fff;
}
.fav-check {
  display: inline-block;
  width: 14px;
}
.fav-sep {
  height: 1px;
  margin: 3px 2px;
  background: #808080;
  box-shadow: 0 1px 0 #fff;
}
/* Barre de menu (style winXP) */
.ie__bar {
  height: 22px;
  width: 100%;
  padding-left: 4px;
  display: flex;
  align-items: center;
  font-size: 12px;
  background: rgb(236, 233, 216);
  flex-shrink: 0;
}
.ie__btn {
  display: flex;
  height: 18px;
  align-items: center;
  border: 1px solid transparent;
  border-radius: 3px;
  cursor: pointer;
  color: #1a1a1a;
  padding: 0 8px;
}
.ie__btn:hover,
.ie__btn.active {
  border-color: rgba(0, 0, 0, 0.18);
  background: rgba(255, 255, 255, 0.5);
}
.ie__btn.active {
  background: #dedede;
}
</style>
