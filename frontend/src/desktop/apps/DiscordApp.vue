<script setup lang="ts">
import { ref, inject } from 'vue'
import { profile } from '../../portfolio'
import { msnEmail, DISCORD_INVITE_URL } from '../msnSession'

// Fenêtre principale MSN Messenger : connexion puis liste de contacts. Le contact
// « Kevin » ouvre une fenêtre de conversation (→ Discord via webhook).
const openApp = inject<(id: string) => void>('openApp', () => {})

const view = ref<'signin' | 'online'>('signin')
const email = ref(profile.email)

function signIn() {
  msnEmail.value = email.value
  view.value = 'online'
}
function openConversation() {
  openApp('msn-chat')
}
function joinServer() {
  if (DISCORD_INVITE_URL) window.open(DISCORD_INVITE_URL, '_blank', 'noopener')
}
</script>

<template>
  <div class="msn">
    <!-- Barre de menus -->
    <div class="msn-menu">
      <span>Fichier</span><span>Contacts</span><span>Actions</span><span>Outils</span><span>?</span>
    </div>

    <!-- En-tête msn Messenger -->
    <div class="msn-brand">
      <img src="/xp/winxp-icons/MSN-Logo-2000.png" alt="msn Messenger" />
    </div>

    <!-- ÉCRAN DE CONNEXION -->
    <template v-if="view === 'signin'">
      <div class="msn-signin">
        <div class="msn-avatar"><img src="/xp/WindowsXPIconsSVG/MSN Messenger.svg" alt="" /></div>

        <label>Adresse e-mail :</label>
        <div class="msn-field">
          <input v-model="email" type="email" />
          <span class="msn-caret">▾</span>
        </div>

        <label>Mot de passe :</label>
        <div class="msn-field"><input type="password" value="passport" /></div>

        <p class="msn-status">État : <b>En ligne</b> <span class="msn-caret">▾</span></p>

        <label class="msn-check"><input type="checkbox" /> Se souvenir de moi</label>
        <label class="msn-check"><input type="checkbox" /> Mémoriser mon mot de passe</label>
        <label class="msn-check"><input type="checkbox" /> Me connecter automatiquement</label>

        <button class="msn-signinbtn" @click="signIn">Se connecter</button>

        <div class="msn-links">
          <a class="inert">Mot de passe oublié ?</a>
          <a class="inert">État du service</a>
          <a class="inert">Obtenir un compte</a>
        </div>

        <div class="msn-buddies"><img src="/xp/WindowsXPIconsSVG/MSN Messenger.svg" alt="" /></div>
      </div>
      <div class="msn-passport">
        <img src="/xp/msn/msnexplorer.png" alt="" />
        Réseau Microsoft Passport
      </div>
    </template>

    <!-- CONNECTÉ : liste de contacts -->
    <template v-else>
      <div class="msn-me">
        <img class="msn-me-pp" src="/xp/WindowsXPIconsSVG/MSN Messenger.svg" alt="" />
        <div class="msn-me-id">
          <p class="msn-me-name">
            {{ email || 'Visiteur' }} <span>(En ligne)</span> <span class="msn-caret">▾</span>
          </p>
          <p class="msn-me-msg">&lt;Tapez un message personnel&gt;</p>
        </div>
      </div>

      <div class="msn-addbar">
        <img src="/xp/winxp-icons/msn.png" alt="" />
        <a class="inert">Ajouter un contact</a>
      </div>

      <!-- Liste -->
      <div class="msn-list">
        <p class="msn-group">▾ Contacts en ligne (1)</p>
        <button class="msn-contact online" @dblclick="openConversation" @click="openConversation">
          <img class="msn-contact-ic" src="/xp/winxp-icons/msn.png" alt="" />
          <span class="msn-contact-name">{{ profile.name }}</span>
          <span class="msn-contact-state">(En ligne)</span>
        </button>

        <p class="msn-group">▾ Hors ligne (0)</p>
        <p class="msn-empty">Aucun contact hors ligne.</p>
      </div>

      <!-- Bandeau .net -->
      <div class="msn-net">
        <img src="/xp/msn/msnlogo.png" alt="msn .net" />
      </div>

      <!-- Pied : rejoindre Discord -->
      <div class="msn-foot">
        <span class="msn-foot-label"
          >Écris à {{ profile.name.split(' ')[0] }} (double-clic) — ça arrive sur son Discord.</span
        >
        <button class="msn-join" @click="joinServer">Rejoindre ↗</button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.msn {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(to bottom, #f4f9ff, #dceaf8);
  font-family: Tahoma, 'Noto Sans', sans-serif;
  font-size: 12px;
  color: #1a1a1a;
}
.inert {
  color: #9a9a9a;
}
.msn-caret {
  color: #4f7bbf;
  font-size: 10px;
}

/* Barre de menus */
.msn-menu {
  display: flex;
  gap: 14px;
  padding: 3px 8px;
  background: linear-gradient(to bottom, #fdfdfd, #e9f1fb);
  border-bottom: 1px solid #b9d2ec;
  flex-shrink: 0;
}
.msn-menu span {
  cursor: default;
}

/* En-tête msn Messenger */
.msn-brand {
  padding: 6px 10px 2px;
  flex-shrink: 0;
}
.msn-brand img {
  height: 22px;
}

/* Écran de connexion */
.msn-signin {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px 22px 12px;
  overflow: auto;
}
.msn-avatar {
  width: 74px;
  height: 74px;
  margin: 6px 0 14px;
  border: 1px solid #9bb8d8;
  border-radius: 6px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}
.msn-avatar img {
  width: 54px;
  height: 54px;
}
.msn-signin label {
  align-self: flex-start;
  font-size: 12px;
  margin: 6px 0 2px;
}
.msn-field {
  position: relative;
  width: 100%;
}
.msn-field input {
  width: 100%;
  box-sizing: border-box;
  font-size: 12px;
  padding: 3px 18px 3px 5px;
  border: 1px solid #7f9db9;
}
.msn-field .msn-caret {
  position: absolute;
  right: 5px;
  top: 4px;
}
.msn-status {
  align-self: flex-start;
  margin: 10px 0 8px;
  font-size: 12px;
}
.msn-check {
  align-self: flex-start;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  margin: 1px 0;
}
.msn-check input {
  width: 13px;
  height: 13px;
}
.msn-signinbtn {
  margin: 14px 0 6px;
  padding: 4px 22px;
  font-size: 12px;
  border: 1px solid #c79a3a;
  border-radius: 3px;
  background: linear-gradient(to bottom, #fff7e0, #ffe7a8);
  cursor: pointer;
}
.msn-signinbtn:hover {
  background: linear-gradient(to bottom, #fffbe9, #ffedbb);
}
.msn-links {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  margin-top: 10px;
}
.msn-links a {
  color: #1c5fd6;
  cursor: pointer;
  text-decoration: underline;
}
.msn-buddies {
  position: absolute;
  right: 8px;
  bottom: 4px;
  opacity: 0.16;
  pointer-events: none;
}
.msn-buddies img {
  width: 96px;
  height: 96px;
}
.msn-passport {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  font-size: 11px;
  color: #355;
  background: #dfeaf6;
  border-top: 1px solid #b9d2ec;
  flex-shrink: 0;
}
.msn-passport img {
  width: 16px;
  height: 16px;
}

/* Connecté : mon identité */
.msn-me {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 10px 6px;
  flex-shrink: 0;
}
.msn-me-pp {
  width: 40px;
  height: 40px;
  border: 1px solid #9bb8d8;
  border-radius: 4px;
  background: #fff;
  padding: 2px;
}
.msn-me-name {
  margin: 0;
  font-weight: bold;
  color: #15317e;
}
.msn-me-name span:first-of-type {
  font-weight: normal;
  color: #2a8a2a;
  font-size: 11px;
}
.msn-me-msg {
  margin: 1px 0 0;
  font-size: 11px;
  color: #888;
}

.msn-addbar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-top: 1px solid #cfe0f3;
  border-bottom: 1px solid #cfe0f3;
  background: #eef5ff;
  flex-shrink: 0;
}
.msn-addbar img {
  width: 16px;
  height: 16px;
}
.msn-addbar a {
  color: #1c5fd6;
  text-decoration: underline;
  cursor: pointer;
}

/* Liste de contacts */
.msn-list {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 4px 6px;
  background: #fff;
}
.msn-group {
  margin: 4px 0 2px;
  font-weight: bold;
  font-size: 11px;
  color: #15317e;
  cursor: default;
}
.msn-contact {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 2px 6px 2px 16px;
  border: 1px solid transparent;
  background: transparent;
  text-align: left;
  cursor: pointer;
  font-size: 12px;
}
.msn-contact:hover {
  background: #e8f0fe;
  border-color: #b6c8e8;
}
.msn-contact-ic {
  width: 16px;
  height: 16px;
}
.msn-contact-name {
  color: #111;
}
.msn-contact-state {
  color: #2a8a2a;
  font-size: 11px;
}
.msn-empty {
  margin: 2px 0 6px 16px;
  font-size: 11px;
  color: #aaa;
}

/* Bandeau .net */
.msn-net {
  flex-shrink: 0;
  padding: 6px;
  background: linear-gradient(to bottom, #eef5ff, #d4e6fb);
  border-top: 1px solid #9cc0e9;
  display: flex;
  justify-content: center;
}
.msn-net img {
  height: 26px;
  object-fit: contain;
}

/* Pied : rejoindre Discord façon XP */
.msn-foot {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 10px;
  background: linear-gradient(to bottom, #f1f6fd, #d7e4f4);
  border-top: 1px solid #9cc0e9;
  flex-shrink: 0;
}
.msn-foot-label {
  flex: 1;
  font-size: 11px;
  color: #355;
}
.msn-join {
  font-family: Tahoma, 'Noto Sans', sans-serif;
  font-size: 12px;
  color: #000;
  padding: 3px 14px;
  border: 1px solid #003c74;
  border-radius: 3px;
  background: linear-gradient(to bottom, #fefefe 0%, #eef3fb 48%, #d8e4f4 52%, #eaf1fb 100%);
  box-shadow: inset 0 0 0 1px #fff;
  cursor: pointer;
}
.msn-join:hover {
  border-color: #e9a900;
  background: linear-gradient(to bottom, #fffefb 0%, #fff3d6 48%, #ffe6a8 52%, #fff2cf 100%);
}
.msn-join:active {
  background: linear-gradient(to bottom, #d8e4f4, #eef3fb);
  box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.2);
}
</style>
