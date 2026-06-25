<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { profile } from '../../portfolio'

// 1) Crée une clé gratuite sur https://web3forms.com (associée à ton email)
// 2) Colle-la ci-dessous. Les messages (et la pièce jointe) te seront envoyés par email.
const WEB3FORMS_ACCESS_KEY = 'd1940332-ca87-44d7-9c71-b5781b0fffcc'

const OE = '/xp/WindowsXPIconsSVG/'

const fromEmail = ref('')
const subject = ref('Prise de contact')
const fileName = ref('')
let file: File | null = null
const status = ref<'idle' | 'sending' | 'sent' | 'error'>('idle')
const errorMsg = ref('')

// --- Éditeur de texte enrichi (contenteditable + document.execCommand) ---
const editor = ref<HTMLElement>()
const charCount = ref(0)
const color = ref('#000000')
const colorInput = ref<HTMLInputElement>()

function focusEditor() {
  editor.value?.focus()
}
function exec(cmd: string, value?: string) {
  focusEditor()
  document.execCommand(cmd, false, value)
}
function onInput() {
  charCount.value = (editor.value?.innerText ?? '').replace(/\n$/, '').length
}
function pickColor() {
  colorInput.value?.click()
}
function applyColor(e: Event) {
  color.value = (e.target as HTMLInputElement).value
  exec('foreColor', color.value)
}

// --- Comboboxes façon Windows XP (police / taille) au lieu des <select> natifs ---
const fonts = ['Arial', 'Times New Roman', 'Courier New', 'Verdana', 'Tahoma', 'Georgia']
const sizes = [
  { v: '1', label: '8' },
  { v: '2', label: '10' },
  { v: '3', label: '12' },
  { v: '4', label: '14' },
  { v: '5', label: '18' },
  { v: '6', label: '24' },
  { v: '7', label: '36' },
]
const fontName = ref('Arial')
const fontSize = ref('2')
const openDd = ref<'font' | 'size' | null>(null)
const sizeLabel = () => sizes.find((s) => s.v === fontSize.value)?.label ?? '10'
function toggleDd(which: 'font' | 'size') {
  openDd.value = openDd.value === which ? null : which
}
function selectFont(f: string) {
  fontName.value = f
  openDd.value = null
  exec('fontName', f)
}
function selectSize(v: string) {
  fontSize.value = v
  openDd.value = null
  exec('fontSize', v)
}

const rootEl = ref<HTMLElement>()
function onDocDown() {
  // Les clics sur les combos sont déjà arrêtés (@pointerdown.stop), donc tout
  // clic qui atteint le document se fait en dehors d'une combobox : on ferme.
  openDd.value = null
}
onMounted(() => document.addEventListener('pointerdown', onDocDown))
onUnmounted(() => document.removeEventListener('pointerdown', onDocDown))

function onFile(e: Event) {
  const input = e.target as HTMLInputElement
  file = input.files?.[0] ?? null
  if (file && file.size > 5 * 1024 * 1024) {
    status.value = 'error'
    errorMsg.value = 'Fichier trop volumineux (max 5 Mo).'
    file = null
    fileName.value = ''
    input.value = ''
    return
  }
  fileName.value = file?.name ?? ''
  status.value = 'idle'
}

async function send() {
  const text = (editor.value?.innerText ?? '').trim()
  if (!text) {
    status.value = 'error'
    errorMsg.value = 'Écris un message avant d’envoyer.'
    return
  }
  if (WEB3FORMS_ACCESS_KEY.startsWith('REMPLACE')) {
    status.value = 'error'
    errorMsg.value = 'Formulaire non configuré (clé Web3Forms manquante).'
    return
  }
  status.value = 'sending'
  try {
    const fd = new FormData()
    fd.append('access_key', WEB3FORMS_ACCESS_KEY)
    fd.append('subject', subject.value || 'Prise de contact')
    fd.append('from_name', fromEmail.value || 'Visiteur')
    fd.append('email', fromEmail.value || 'no-reply@portfolio')
    fd.append('message', text)
    if (file) fd.append('attachment', file, file.name)
    const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: fd })
    const data = await res.json()
    if (data.success) {
      status.value = 'sent'
      if (editor.value) editor.value.innerHTML = ''
      charCount.value = 0
      fromEmail.value = ''
      file = null
      fileName.value = ''
    } else {
      throw new Error(data.message || 'Échec de l’envoi')
    }
  } catch (e) {
    status.value = 'error'
    errorMsg.value = e instanceof Error ? e.message : 'Échec de l’envoi'
  }
}
</script>

<template>
  <div ref="rootEl" class="oe">
    <!-- Menu -->
    <div class="menubar">
      <span>Fichier</span><span>Edition</span><span>Affichage</span><span>Insertion</span
      ><span>Format</span><span>Outils</span><span>Message</span><span>?</span>
    </div>

    <!-- Barre d'outils (icônes Outlook Express authentiques) -->
    <div class="toolbar">
      <button class="tb send" :disabled="status === 'sending'" @click="send">
        <img :src="OE + 'OE Send.svg'" alt="" /><span>Envoyer</span>
      </button>
      <span class="sep"></span>
      <button class="tb" @click="exec('cut')"><img :src="OE + 'Cut.svg'" alt="" />Couper</button>
      <button class="tb" @click="exec('copy')"><img :src="OE + 'Copy.svg'" alt="" />Copier</button>
      <button class="tb" @click="exec('paste')"><img :src="OE + 'Paste.svg'" alt="" />Coller</button>
      <span class="sep"></span>
      <button class="tb" @click="exec('undo')"><img :src="OE + 'Undo.svg'" alt="" />Annuler</button>
      <span class="sep"></span>
      <label class="tb attach">
        <img :src="OE + 'OE Attatch.svg'" alt="" />Joindre
        <input type="file" hidden @change="onFile" />
      </label>
    </div>

    <!-- En-têtes -->
    <div class="headers">
      <div class="row">
        <label><img :src="OE + 'OE Recipients.svg'" class="hico" alt="" /> À :</label>
        <div class="to">{{ profile.name }} &lt;{{ profile.email }}&gt;</div>
      </div>
      <div class="row">
        <label>De :</label>
        <input v-model="fromEmail" type="email" placeholder="votre email (pour la réponse)" />
      </div>
      <div class="row"><label>Objet :</label><input v-model="subject" type="text" /></div>
      <div v-if="fileName" class="row">
        <label><img :src="OE + 'OE Attatch.svg'" class="hico" alt="" /> Joint :</label>
        <div class="to">{{ fileName }}</div>
      </div>
    </div>

    <!-- Barre de mise en forme (fonctionnelle) -->
    <div class="format">
      <!-- Combobox Police (style XP) -->
      <div class="combo font" :class="{ open: openDd === 'font' }" @pointerdown.stop="toggleDd('font')">
        <span class="combo-val">{{ fontName }}</span>
        <span class="combo-arrow">▼</span>
        <div v-if="openDd === 'font'" class="combo-list" @pointerdown.stop>
          <div
            v-for="f in fonts"
            :key="f"
            class="combo-opt"
            :class="{ sel: f === fontName }"
            :style="{ fontFamily: f }"
            @click="selectFont(f)"
          >
            {{ f }}
          </div>
        </div>
      </div>
      <!-- Combobox Taille (style XP) -->
      <div class="combo size" :class="{ open: openDd === 'size' }" @pointerdown.stop="toggleDd('size')">
        <span class="combo-val">{{ sizeLabel() }}</span>
        <span class="combo-arrow">▼</span>
        <div v-if="openDd === 'size'" class="combo-list" @pointerdown.stop>
          <div
            v-for="s in sizes"
            :key="s.v"
            class="combo-opt"
            :class="{ sel: s.v === fontSize }"
            @click="selectSize(s.v)"
          >
            {{ s.label }}
          </div>
        </div>
      </div>

      <span class="sep"></span>
      <button class="ft b" title="Gras" @click="exec('bold')">G</button>
      <button class="ft i" title="Italique" @click="exec('italic')">I</button>
      <button class="ft u" title="Souligné" @click="exec('underline')">S</button>
      <button class="ft color" title="Couleur" @click="pickColor">
        A<span class="bar" :style="{ background: color }"></span>
      </button>
      <input ref="colorInput" type="color" class="hidden-color" :value="color" @input="applyColor" />

      <span class="sep"></span>
      <button class="ft" title="Liste à puces" @click="exec('insertUnorderedList')">
        <svg width="16" height="16" viewBox="0 0 16 16"><circle cx="2.5" cy="4" r="1.5" /><circle cx="2.5" cy="8" r="1.5" /><circle cx="2.5" cy="12" r="1.5" /><rect x="6" y="3.2" width="8" height="1.6" /><rect x="6" y="7.2" width="8" height="1.6" /><rect x="6" y="11.2" width="8" height="1.6" /></svg>
      </button>
      <button class="ft" title="Liste numérotée" @click="exec('insertOrderedList')">
        <svg width="16" height="16" viewBox="0 0 16 16"><text x="0" y="5.5" font-size="5">1.</text><text x="0" y="10" font-size="5">2.</text><text x="0" y="14.5" font-size="5">3.</text><rect x="6" y="3.2" width="8" height="1.6" /><rect x="6" y="7.2" width="8" height="1.6" /><rect x="6" y="11.2" width="8" height="1.6" /></svg>
      </button>
      <button class="ft" title="Diminuer le retrait" @click="exec('outdent')">
        <svg width="16" height="16" viewBox="0 0 16 16"><rect x="6" y="2" width="8" height="1.6" /><rect x="6" y="11" width="8" height="1.6" /><rect x="0" y="5.4" width="8" height="1.6" /><rect x="0" y="8.2" width="8" height="1.6" /><path d="M4 5 L1 7.4 L4 9.8 Z" /></svg>
      </button>
      <button class="ft" title="Augmenter le retrait" @click="exec('indent')">
        <svg width="16" height="16" viewBox="0 0 16 16"><rect x="2" y="2" width="12" height="1.6" /><rect x="2" y="11" width="12" height="1.6" /><rect x="6" y="5.4" width="8" height="1.6" /><rect x="6" y="8.2" width="8" height="1.6" /><path d="M1 5 L4 7.4 L1 9.8 Z" /></svg>
      </button>
      <span class="sep"></span>
      <button class="ft" title="Aligner à gauche" @click="exec('justifyLeft')">
        <svg width="16" height="16" viewBox="0 0 16 16"><rect x="1" y="2.5" width="14" height="1.6" /><rect x="1" y="6" width="9" height="1.6" /><rect x="1" y="9.5" width="14" height="1.6" /><rect x="1" y="13" width="9" height="1.6" /></svg>
      </button>
      <button class="ft" title="Centrer" @click="exec('justifyCenter')">
        <svg width="16" height="16" viewBox="0 0 16 16"><rect x="1" y="2.5" width="14" height="1.6" /><rect x="3.5" y="6" width="9" height="1.6" /><rect x="1" y="9.5" width="14" height="1.6" /><rect x="3.5" y="13" width="9" height="1.6" /></svg>
      </button>
      <button class="ft" title="Aligner à droite" @click="exec('justifyRight')">
        <svg width="16" height="16" viewBox="0 0 16 16"><rect x="1" y="2.5" width="14" height="1.6" /><rect x="6" y="6" width="9" height="1.6" /><rect x="1" y="9.5" width="14" height="1.6" /><rect x="6" y="13" width="9" height="1.6" /></svg>
      </button>
      <button class="ft" title="Justifier" @click="exec('justifyFull')">
        <svg width="16" height="16" viewBox="0 0 16 16"><rect x="1" y="2.5" width="14" height="1.6" /><rect x="1" y="6" width="14" height="1.6" /><rect x="1" y="9.5" width="14" height="1.6" /><rect x="1" y="13" width="9" height="1.6" /></svg>
      </button>
      <span class="sep"></span>
      <button class="ft" title="Trait horizontal" @click="exec('insertHorizontalRule')">
        <svg width="16" height="16" viewBox="0 0 16 16"><rect x="1" y="7.2" width="14" height="1.6" /></svg>
      </button>
    </div>

    <!-- Corps (éditeur enrichi) -->
    <div
      ref="editor"
      class="body"
      contenteditable="true"
      spellcheck="false"
      data-placeholder="Écris ton message…"
      @input="onInput"
    ></div>

    <!-- Barre d'état -->
    <div class="statusbar">
      <span class="sb-msg">
        <span v-if="status === 'sending'">Envoi en cours…</span>
        <span v-else-if="status === 'sent'" class="ok">Message envoyé, merci ! ✓</span>
        <span v-else-if="status === 'error'" class="err">{{ errorMsg }}</span>
        <span v-else>Prêt</span>
      </span>
      <span class="sb-count">{{ charCount }} caractère{{ charCount > 1 ? 's' : '' }}</span>
    </div>
  </div>
</template>

<style scoped>
.oe {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #ece9d8;
  font-family: Tahoma, sans-serif;
}
.menubar {
  display: flex;
  gap: 12px;
  padding: 3px 8px;
  font-size: 12px;
  color: #1a1a1a;
  background: #ece9d8;
  flex-shrink: 0;
}
.menubar span {
  cursor: default;
}

/* Barre d'outils */
.toolbar {
  display: flex;
  align-items: stretch;
  gap: 2px;
  padding: 3px 6px;
  background: linear-gradient(to bottom, #fbfbf8, #e7e4d7);
  border-top: 1px solid #fff;
  border-bottom: 1px solid #aca899;
  flex-shrink: 0;
}
.tb {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 2px;
  min-width: 52px;
  border: 1px solid transparent;
  background: transparent;
  border-radius: 3px;
  padding: 3px 6px;
  font-size: 11px;
  color: #333;
  cursor: pointer;
}
.tb img {
  width: 26px;
  height: 26px;
  object-fit: contain;
}
.tb:not(:disabled):hover {
  border-color: #b6c8e8;
  background: #eef4fd;
}
.tb:not(:disabled):active {
  border-color: #7f9db9;
  background: #d8e6fb;
}
.tb:disabled {
  opacity: 0.5;
  cursor: default;
}
.tb.send {
  color: #14315a;
  font-weight: bold;
}
.toolbar .sep {
  width: 1px;
  margin: 2px 4px;
  background: #c5c2b8;
}

/* En-têtes */
.headers {
  background: #fff;
  border-bottom: 1px solid #aca899;
  padding: 2px 0;
  flex-shrink: 0;
}
.headers .row {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eee;
}
.headers .row:last-child {
  border-bottom: none;
}
.headers label {
  width: 72px;
  text-align: right;
  padding: 4px 8px;
  font-size: 12px;
  color: #333;
  background: #ece9d8;
  align-self: stretch;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  flex-shrink: 0;
}
.headers label .hico {
  width: 15px;
  height: 15px;
  object-fit: contain;
}
.headers .to {
  padding: 4px 8px;
  font-size: 12px;
  color: #222;
}
.headers input {
  flex: 1;
  border: none;
  outline: none;
  padding: 4px 8px;
  font-size: 12px;
}

/* Barre de mise en forme */
.format {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 3px 6px;
  background: #ece9d8;
  border-bottom: 1px solid #aca899;
  flex-shrink: 0;
}
.format .sep {
  width: 1px;
  height: 18px;
  background: #aca899;
  margin: 0 3px;
}

/* Comboboxes XP (police / taille) */
.combo {
  position: relative;
  display: inline-flex;
  align-items: center;
  height: 21px;
  background: #fff;
  border: 1px solid #7f9db9;
  cursor: default;
  user-select: none;
}
.combo.font {
  width: 130px;
}
.combo.size {
  width: 50px;
}
.combo-val {
  flex: 1;
  padding: 0 5px;
  font-size: 11px;
  color: #111;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.combo-arrow {
  width: 16px;
  align-self: stretch;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 7px;
  color: #1a3d6e;
  background: linear-gradient(to bottom, #fdfdfd, #d3dcea);
  border-left: 1px solid #7f9db9;
}
.combo.open .combo-arrow {
  background: linear-gradient(to bottom, #c3cfe0, #e8edf5);
}
.combo-list {
  position: absolute;
  top: 100%;
  left: -1px;
  right: -1px;
  z-index: 70;
  max-height: 210px;
  overflow: auto;
  background: #fff;
  border: 1px solid #7f9db9;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
}
.combo-opt {
  padding: 2px 6px;
  font-size: 11px;
  color: #111;
  cursor: default;
  white-space: nowrap;
}
.combo-opt.sel {
  background: #dbe6ff;
}
.combo-opt:hover {
  background: #2f71cd;
  color: #fff;
}

/* Boutons de mise en forme */
.ft {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 23px;
  height: 22px;
  border: 1px solid transparent;
  border-radius: 3px;
  background: transparent;
  font-size: 13px;
  color: #1a1a1a;
  cursor: pointer;
}
.ft:hover {
  border-color: #b6c8e8;
  background: #eef4fd;
}
.ft:active {
  border-color: #7f9db9;
  background: #d8e6fb;
}
.ft svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  fill: #1a1a1a;
}
.ft.b {
  font-weight: bold;
  font-family: Georgia, serif;
}
.ft.i {
  font-style: italic;
  font-family: Georgia, serif;
}
.ft.u {
  text-decoration: underline;
  font-family: Georgia, serif;
}
.ft.color {
  position: relative;
  font-weight: bold;
  padding-bottom: 4px;
}
.ft.color .bar {
  position: absolute;
  left: 4px;
  right: 4px;
  bottom: 3px;
  height: 3px;
}
.hidden-color {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
}

/* Corps */
.body {
  flex: 1;
  min-height: 0;
  overflow: auto;
  border: none;
  outline: none;
  padding: 8px 10px;
  font-family: Arial, sans-serif;
  font-size: 13px;
  line-height: 1.5;
  color: #111;
  background: #fff;
}
.body:empty::before {
  content: attr(data-placeholder);
  color: #9a9a9a;
}

/* Barre d'état (façon XP, avec compteur de caractères) */
.statusbar {
  display: flex;
  align-items: stretch;
  border-top: 1px solid #fff;
  background: #ece9d8;
  font-size: 11px;
  color: #555;
  flex-shrink: 0;
}
.sb-msg {
  flex: 1;
  padding: 3px 8px;
}
.sb-count {
  padding: 3px 12px;
  border-left: 1px solid #aca899;
  box-shadow: inset 1px 0 0 #fff;
}
.statusbar .ok {
  color: #1a7a1a;
}
.statusbar .err {
  color: #b00000;
}
</style>
