<script setup lang="ts">
import { ref } from 'vue'

// 1) Crée une clé gratuite sur https://web3forms.com (associée à ton email)
// 2) Colle-la ci-dessous. Les messages te seront envoyés par email.
const WEB3FORMS_ACCESS_KEY = 'REMPLACE_PAR_TA_CLE_WEB3FORMS'

const name = ref('')
const email = ref('')
const message = ref('')
const status = ref<'idle' | 'sending' | 'sent' | 'error'>('idle')
const errorMsg = ref('')

async function send() {
  if (!message.value.trim()) {
    status.value = 'error'
    errorMsg.value = 'Écris un message avant d’envoyer.'
    return
  }
  if (WEB3FORMS_ACCESS_KEY.startsWith('REMPLACE')) {
    status.value = 'error'
    errorMsg.value = 'Le livre d’or n’est pas encore configuré (clé Web3Forms manquante).'
    return
  }
  status.value = 'sending'
  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: 'Nouveau message — livre d’or du portfolio',
        from_name: name.value || 'Visiteur',
        name: name.value || 'Visiteur',
        email: email.value || 'no-reply@portfolio',
        message: message.value,
      }),
    })
    const data = await res.json()
    if (data.success) {
      status.value = 'sent'
      name.value = ''
      email.value = ''
      message.value = ''
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

    <div class="fields">
      <label>Nom <input type="text" v-model="name" placeholder="Ton nom" /></label>
      <label>Email <input type="email" v-model="email" placeholder="(optionnel)" /></label>
    </div>

    <textarea
      class="paper"
      v-model="message"
      spellcheck="false"
      placeholder="Laisse-moi un message…"
    ></textarea>

    <div class="actions">
      <span class="status" :class="status">
        <template v-if="status === 'sending'">Envoi…</template>
        <template v-else-if="status === 'sent'">Message envoyé, merci ! ✓</template>
        <template v-else-if="status === 'error'">{{ errorMsg }}</template>
      </span>
      <button :disabled="status === 'sending'" @click="send">Envoyer</button>
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
.fields {
  display: flex;
  gap: 12px;
  padding: 8px 10px 4px;
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
  margin: 6px 10px;
  resize: none;
  border: 1px solid #7f9db9;
  padding: 6px 8px;
  font-family: 'Lucida Console', monospace;
  font-size: 13px;
  line-height: 1.5;
  color: #111;
  outline: none;
}
.actions {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 10px 10px;
  flex-shrink: 0;
}
.status {
  font-size: 12px;
  flex: 1;
  color: #555;
}
.status.sent {
  color: #1a7a1a;
}
.status.error {
  color: #b00000;
}
.actions button {
  min-width: 80px;
}
</style>
