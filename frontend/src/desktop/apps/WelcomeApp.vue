<script setup lang="ts">
import { inject } from 'vue'
import { useWindows, type WinState } from '../useWindows'
import { profile } from '../../portfolio'

// Fenêtre « Mise en route » façon volet de tâches XP : un raccourci rapide vers
// l'essentiel pour les visiteurs pressés, sans casser l'exploration du bureau.
const openApp = inject<(id: string) => void>('openApp', () => {})
const win = inject<WinState | null>('win', null)
const { close } = useWindows()

function closeSelf() {
  if (win) close(win)
}
function run(id: string) {
  openApp(id)
  closeSelf()
}

const tasks = [
  {
    label: 'Voir mon profil',
    desc: 'Qui je suis, mon parcours et mes compétences (WikiDK).',
    icon: '/xp/windowsIcons/user.png',
    onClick: () => run('iexplorer'),
  },
  {
    label: 'Voir mes projets',
    desc: 'Mes réalisations DevOps, Cloud et Infrastructure as Code.',
    icon: '/xp/win/folder.png',
    onClick: () => run('projects'),
  },
  {
    label: 'Voir / télécharger mon CV',
    desc: 'Mon dossier de candidature au format PDF.',
    icon: '/xp/icons/pdf.svg',
    onClick: () => run('cv-fr'),
  },
  {
    label: 'Explorer le bureau',
    desc: 'Pour les curieux : terminal, jeux, explorateur… à la sauce Windows XP.',
    icon: '/xp/windoors-2.svg',
    onClick: () => closeSelf(),
  },
]
</script>

<template>
  <div class="welcome">
    <!-- Volet latéral d'accueil -->
    <aside class="welcome-side">
      <img class="welcome-flag" src="/xp/windoors-2.svg" alt="" />
      <p class="welcome-hi">Bienvenue</p>
      <p class="welcome-name">{{ profile.name }}</p>
      <p class="welcome-role">{{ profile.role }}</p>
      <p class="welcome-tag">{{ profile.tagline }}</p>
    </aside>

    <!-- Tâches rapides -->
    <div class="welcome-main">
      <p class="welcome-lead">Que souhaitez-vous faire ?</p>
      <button v-for="t in tasks" :key="t.label" class="task" @click="t.onClick">
        <img class="task-ico" :src="t.icon" alt="" />
        <span class="task-text">
          <b>{{ t.label }}</b>
          <small>{{ t.desc }}</small>
        </span>
        <img class="task-arrow" src="/xp/start/greenarrow.png" alt="" />
      </button>
      <p class="welcome-foot">
        Astuce : vous pouvez fermer cette fenêtre à tout moment et explorer le bureau.
      </p>
    </div>
  </div>
</template>

<style scoped>
.welcome {
  display: flex;
  height: 100%;
  background: #fff;
  font-family: Tahoma, 'Noto Sans', sans-serif;
}

/* Volet latéral */
.welcome-side {
  width: 190px;
  flex-shrink: 0;
  padding: 16px 14px;
  color: #fff;
  background: linear-gradient(160deg, #2f7d3a 0%, #1f5fce 60%, #16469f 100%);
}
.welcome-flag {
  width: 38px;
  height: 38px;
  margin-bottom: 8px;
}
.welcome-hi {
  margin: 0;
  font-size: 22px;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4);
}
.welcome-name {
  margin: 10px 0 2px;
  font-size: 14px;
  font-weight: bold;
}
.welcome-role {
  margin: 0 0 10px;
  font-size: 12px;
  opacity: 0.9;
}
.welcome-tag {
  margin: 0;
  font-size: 11px;
  line-height: 1.5;
  opacity: 0.85;
}

/* Zone des tâches */
.welcome-main {
  flex: 1;
  min-width: 0;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  overflow: auto;
}
.welcome-lead {
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: bold;
  color: #16469f;
}
.task {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  text-align: left;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 4px;
  padding: 8px 10px;
  cursor: pointer;
}
.task:hover {
  background: #eaf1fc;
  border-color: #b6c8e8;
}
.task-ico {
  width: 32px;
  height: 32px;
  object-fit: contain;
  flex-shrink: 0;
}
.task-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  line-height: 1.3;
}
.task-text b {
  font-size: 13px;
  color: #1c4587;
}
.task-text small {
  font-size: 11px;
  color: #555;
}
.task-arrow {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}
.welcome-foot {
  margin: auto 0 0;
  padding-top: 12px;
  font-size: 11px;
  color: #888;
}
</style>
