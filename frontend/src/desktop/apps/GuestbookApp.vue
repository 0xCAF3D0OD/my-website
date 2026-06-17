<script setup lang="ts">
import { ref } from 'vue'

// 1) Crée une clé gratuite sur https://web3forms.com (associée à ton email)
// 2) Colle-la ci-dessous. Les messages (et la pièce jointe) te seront envoyés par email.
const WEB3FORMS_ACCESS_KEY = 'REMPLACE_PAR_TA_CLE_WEB3FORMS'

const name = ref('')
const email = ref('')
const message = ref('')
const fileName = ref('')
let file: File | null = null
const status = ref<'idle' | 'sending' | 'sent' | 'error'>('idle')
const errorMsg = ref('')

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
  if (!message.value.trim()) {
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
    fd.append('subject', 'Nouveau contact depuis le portfolio')
    fd.append('from_name', name.value || 'Visiteur')
    fd.append('name', name.value || 'Visiteur')
    fd.append('email', email.value || 'no-reply@portfolio')
    fd.append('message', message.value)
    if (file) fd.append('attachment', file, file.name)
    const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: fd })
    const data = await res.json()
    if (data.success) {
      status.value = 'sent'
      name.value = ''
      email.value = ''
      message.value = ''
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
  <div class="notepad">
    <div class="menubar">
      <span>Fichier</span><span>Édition</span><span>Format</span><span>Affichage</span><span>?</span>
    </div>

    <div class="intro">Une question, une opportunité ? Écris-moi — je te réponds par email.</div>

    <div class="fields">
      <label>Nom <input type="text" v-model="name" placeholder="Ton nom" /></label>
      <label>Email <input type="email" v-model="email" placeholder="pour la réponse" /></label>
    </div>

    <textarea
      class="paper"
      v-model="message"
      spellcheck="false"
      wrap="soft"
      placeholder="Ton message…"
    ></textarea>

    <div class="attach">
      <label class="filebtn">
        📎 Joindre un fichier
        <input type="file" @change="onFile" hidden />
      </label>
      <span class="fname">{{ fileName || 'aucun fichier' }}</span>
    </div>

    <div class="status-bar">
      <div class="status-bar-field grow">
        <span v-if="status === 'sending'">Envoi en cours…</span>
        <span v-else-if="status === 'sent'" class="ok">Message envoyé, merci ! ✓</span>
        <span v-else-if="status === 'error'" class="err">{{ errorMsg }}</span>
        <span v-else>Prêt</span>
      </div>
      <div class="status-bar-field">
        <button :disabled="status === 'sending'" @click="send">Envoyer</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.notepad {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
}
.menubar {
  display: flex;
  gap: 14px;
  padding: 3px 8px;
  font-size: 12px;
  color: #1a1a1a;
  border-bottom: 1px solid #d6d3ce;
  flex-shrink: 0;
}
.menubar span {
  cursor: default;
}
.intro {
  padding: 8px 10px 2px;
  font-size: 12px;
  color: #333;
  flex-shrink: 0;
}
.fields {
  display: flex;
  gap: 12px;
  padding: 6px 10px 4px;
  flex-shrink: 0;
}
.fields label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #333;
}
.fields input {
  width: 150px;
}
.paper {
  flex: 1;
  min-height: 0;
  margin: 4px 10px;
  resize: none;
  border: 1px solid #7f9db9;
  padding: 6px 8px;
  font-family: 'Lucida Console', monospace;
  font-size: 13px;
  line-height: 1.5;
  color: #111;
  outline: none;
}
.attach {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 10px 6px;
  flex-shrink: 0;
}
.filebtn {
  font-size: 12px;
  border: 1px solid #003c74;
  border-radius: 3px;
  padding: 3px 10px;
  background: linear-gradient(180deg, #fff 0%, #ecebe5 86%, #d8d0c4 100%);
  cursor: pointer;
}
.filebtn:hover {
  box-shadow:
    inset -1px 1px #fff0cf,
    inset 1px 2px #fdd889,
    inset -2px 2px #fbc761,
    inset 2px -2px #e5a01a;
}
.fname {
  font-size: 11px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.status-bar {
  display: flex;
  gap: 2px;
  padding: 2px 3px;
  background: #ece9d8;
  border-top: 1px solid #fff;
  flex-shrink: 0;
}
.status-bar-field {
  box-shadow: inset 1px 1px #808080, inset -1px -1px #fff;
  padding: 2px 4px;
  font-size: 12px;
  display: flex;
  align-items: center;
}
.status-bar-field.grow {
  flex: 1;
}
.status-bar-field .ok {
  color: #1a7a1a;
}
.status-bar-field .err {
  color: #b00000;
}
</style>
