<script setup lang="ts">
import { inject } from 'vue'

// Centre de sécurité Windows (reproduction fidèle de la fenêtre XP). Un clic sur
// « Protection antivirus » (INTROUVABLE) lance le simulateur d'erreurs.
const SVG = '/xp/WindowsXPIconsSVG/'
const launchWinError = inject<() => void>('launchWinError', () => {})
function launch() {
  launchWinError()
}
</script>

<template>
  <div class="sec">
    <!-- Bandeau d'en-tête -->
    <div class="sec-head">
      <div class="sec-head-brand">
        <img :src="SVG + 'Security Center.svg'" alt="" />
        <div>
          <p class="sec-head-title">Centre de sécurité</p>
          <p class="sec-head-sub">Contribue à protéger votre PC</p>
        </div>
      </div>
    </div>

    <div class="sec-body">
      <!-- Volet Ressources -->
      <aside class="sec-res">
        <div class="sec-res-h">
          <img :src="SVG + 'Security Question.svg'" alt="" />
          <span>Ressources</span>
        </div>
        <ul>
          <li>
            <a class="inert"
              >Obtenir les dernières informations de sécurité et sur les virus de Microsoft</a
            >
          </li>
          <li><a class="inert">Rechercher les dernières mises à jour de Windows Update</a></li>
          <li><a class="inert">Obtenir de l'aide pour les problèmes de sécurité</a></li>
          <li><a class="inert">Obtenir de l'aide sur le Centre de sécurité</a></li>
          <li><a class="inert">Modifier le mode d'avertissement du Centre de sécurité</a></li>
        </ul>
      </aside>

      <!-- Contenu principal -->
      <main class="sec-main">
        <h2>Éléments essentiels de sécurité</h2>
        <p class="sec-intro">
          Le Centre de sécurité vous aide à gérer vos paramètres de sécurité Windows. Pour protéger
          votre ordinateur, assurez-vous que les trois éléments essentiels sont marqués ACTIVÉ. Si
          les paramètres ne sont pas ACTIVÉS, suivez les recommandations.
          <a class="inert">Nouveautés de Windows pour protéger mon ordinateur ?</a>
        </p>

        <!-- Pare-feu : ACTIVÉ -->
        <div class="sec-item">
          <div class="sec-item-bar">
            <img :src="SVG + 'Firewall.svg'" alt="" />
            <span class="sec-item-name">Pare-feu</span>
            <span class="sec-status on"><i class="orb green"></i> ACTIVÉ</span>
            <span class="sec-chev">⌄</span>
          </div>
        </div>

        <!-- Mises à jour automatiques : VÉRIFIER -->
        <div class="sec-item">
          <div class="sec-item-bar warn">
            <img :src="SVG + 'Windows Update.svg'" alt="" />
            <span class="sec-item-name">Mises à jour automatiques</span>
            <span class="sec-status check"><i class="orb yellow"></i> VÉRIFIER LES PARAMÈTRES</span>
            <span class="sec-chev">⌄</span>
          </div>
        </div>

        <!-- Protection antivirus : INTROUVABLE (déplié, cliquable → simulateur) -->
        <div class="sec-item danger">
          <div class="sec-item-bar red" title="Cliquez pour ouvrir les recommandations" @click="launch">
            <img :src="SVG + 'Virus Protection.svg'" alt="" />
            <span class="sec-item-name">Protection antivirus</span>
            <span class="sec-status found"><i class="orb red"></i> INTROUVABLE</span>
            <span class="sec-chev">⌃</span>
          </div>
          <div class="sec-item-detail">
            <p>
              Windows n'a pas trouvé de logiciel antivirus sur cet ordinateur. Un logiciel antivirus
              contribue à protéger votre ordinateur contre les virus et autres menaces. Cliquez sur
              Recommandations pour connaître les actions suggérées.
              <a class="inert">Comment un logiciel antivirus protège-t-il mon ordinateur ?</a>
            </p>
            <p class="sec-note">
              Remarque : Windows ne détecte pas tous les programmes antivirus.
            </p>
            <div class="sec-detail-actions">
              <button class="sec-reco" @click="launch">Recommandations…</button>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Pied -->
    <div class="sec-foot">
      Chez Microsoft, nous respectons votre vie privée. Consultez notre
      <a class="inert">déclaration de confidentialité</a>.
    </div>
  </div>
</template>

<style scoped>
.sec {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #ece9d8;
  font-family: Tahoma, 'Noto Sans', sans-serif;
  font-size: 12px;
  color: #111;
}
.inert {
  color: #1a4fc4;
  text-decoration: underline;
  cursor: pointer;
}

/* En-tête */
.sec-head {
  flex-shrink: 0;
  height: 62px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 14px;
  background:
    linear-gradient(to bottom, rgba(83, 141, 232, 0.15), rgba(24, 71, 176, 0.55)),
    linear-gradient(to bottom, #7db2f0 0%, #3f77d6 55%, #1e56bf 100%);
  color: #fff;
}
.sec-head-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.35);
}
.sec-head-brand img {
  width: 34px;
  height: 34px;
}
.sec-head-title {
  margin: 0;
  font-size: 22px;
  font-weight: 500;
  line-height: 1.05;
}
.sec-head-sub {
  margin: 0;
  font-size: 12px;
  text-align: right;
}

/* Corps */
.sec-body {
  flex: 1;
  min-height: 0;
  display: flex;
  gap: 10px;
  padding: 10px;
  overflow: auto;
  background: linear-gradient(to bottom, #dbe7f7, #c9dbf1);
}

/* Volet ressources */
.sec-res {
  width: 190px;
  flex-shrink: 0;
  align-self: flex-start;
  background: #fff;
  border: 1px solid #a9c0e4;
  border-radius: 6px;
  overflow: hidden;
}
.sec-res-h {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  font-weight: bold;
  color: #15428b;
  background: linear-gradient(to bottom, #f4f8ff, #dfeafc);
  border-bottom: 1px solid #cdddf2;
}
.sec-res-h img {
  width: 20px;
  height: 20px;
}
.sec-res ul {
  list-style: none;
  margin: 0;
  padding: 8px 10px;
}
.sec-res li {
  margin-bottom: 10px;
  padding-left: 10px;
  position: relative;
  line-height: 1.35;
}
.sec-res li::before {
  content: '▪';
  position: absolute;
  left: 0;
  color: #1a4fc4;
}

/* Contenu principal */
.sec-main {
  flex: 1;
  min-width: 0;
}
.sec-main h2 {
  margin: 0 0 6px;
  font-size: 16px;
  font-weight: 500;
  color: #0a1a3a;
}
.sec-intro {
  margin: 0 0 12px;
  line-height: 1.45;
  color: #222;
}

/* Barres d'état */
.sec-item {
  margin-bottom: 8px;
  border: 1px solid #9fbce4;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
}
.sec-item-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  background: linear-gradient(to bottom, #eff5ff, #cfe0f6);
}
.sec-item-bar.warn {
  background: linear-gradient(to bottom, #fff6da, #ffe6a6);
}
.sec-item-bar.red {
  background: linear-gradient(to bottom, #ffd9cf, #ff9c86);
  cursor: pointer;
}
.sec-item-bar.red:hover {
  background: linear-gradient(to bottom, #ffe1d9, #ffab97);
}
.sec-item-bar img {
  width: 22px;
  height: 22px;
}
.sec-item-name {
  flex: 1;
  font-size: 15px;
  font-weight: 500;
  color: #0a1a3a;
}
.sec-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 0.3px;
}
.sec-status.on {
  color: #1f8a1f;
}
.sec-status.check {
  color: #9a6b00;
}
.sec-status.found {
  color: #c0230f;
}
.orb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  box-shadow: inset -1px -1px 2px rgba(0, 0, 0, 0.35);
}
.orb.green {
  background: radial-gradient(circle at 35% 30%, #b6ff8a, #2aa02a 70%);
}
.orb.yellow {
  background: radial-gradient(circle at 35% 30%, #fff0a8, #e0a400 70%);
}
.orb.red {
  background: radial-gradient(circle at 35% 30%, #ffb0a0, #cc2412 70%);
}
.sec-chev {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-left: 1px solid rgba(0, 0, 0, 0.15);
  color: #14428b;
  font-weight: bold;
}

/* Détail antivirus */
.sec-item-detail {
  padding: 10px 12px 12px;
  background: #fdf6e8;
  border-top: 1px solid #e6d9b8;
  line-height: 1.45;
}
.sec-item-detail p {
  margin: 0 0 8px;
}
.sec-note {
  color: #555;
}
.sec-detail-actions {
  display: flex;
  justify-content: flex-end;
}
.sec-reco {
  font-family: inherit;
  font-size: 12px;
  padding: 3px 12px;
  border: 1px solid #7f9db9;
  border-radius: 3px;
  background: linear-gradient(to bottom, #fff, #e3e9f2);
  cursor: pointer;
}
.sec-reco:hover {
  border-color: #e9a900;
  background: linear-gradient(to bottom, #fffdf5, #ffe9b8);
}

/* Pied */
.sec-foot {
  flex-shrink: 0;
  padding: 6px 12px;
  background: linear-gradient(to bottom, #dbe7f7, #b9cdec);
  border-top: 1px solid #9fbce4;
  color: #223;
}
</style>
