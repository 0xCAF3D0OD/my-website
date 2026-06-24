<script setup lang="ts">
// Centre d'aide et de support façon Windows XP.
// Contenu factuel : procédure réelle de l'« Assistance à distance » (Remote
// Assistance) de Windows XP. Source : csgnetwork.com/rdcsupport.html
const steps = [
  'Cliquez sur Démarrer, puis sur Aide et support.',
  'Dans le Centre d\'aide et de support, sous « Demander de l\'assistance », cliquez sur « Inviter un ami à se connecter à votre ordinateur avec l\'Assistance à distance ».',
  'Cliquez sur « Inviter une personne à vous aider ».',
  'Choisissez un contact Windows Messenger ou saisissez une adresse e-mail, puis cliquez sur « Inviter cette personne ». Par e-mail, vous indiquerez un objet, un message et un mot de passe.',
  'Avec Windows Messenger, l\'invitation est envoyée par message instantané : la personne ouvre la fenêtre et clique sur « Accepter ». Par e-mail, elle ouvre la pièce jointe.',
  'Si l\'expert est invité à se connecter à votre ordinateur, il clique sur « Oui ».',
  'Lorsque l\'on vous demande l\'autorisation de partager votre écran, cliquez sur « Oui ».',
  'Si le réseau est correctement configuré, la fenêtre d\'Assistance à distance s\'ouvre. Vous pouvez y échanger des messages, comme en messagerie instantanée. Si elle n\'apparaît pas, votre réseau ne prend pas en charge l\'Assistance à distance.',
  'Sur l\'ordinateur de l\'expert, une grande fenêtre affiche votre Bureau. Tout ce que vous faites s\'y reflète. Pour prendre la main, il clique sur « Prendre le contrôle ».',
  'Sur votre ordinateur, l\'Assistance à distance vous demande d\'autoriser l\'expert à prendre le contrôle : cliquez sur « Oui ».',
  'L\'expert clique sur « OK » sur son ordinateur.',
  'Vous partagez alors le contrôle de votre ordinateur : vous montrez le problème, l\'expert vous guide pour le résoudre. Pour mettre fin au contrôle, appuyez sur Échap ou cliquez sur « Arrêter le contrôle ».',
  'L\'expert confirme par « OK » qu\'il ne fait plus que voir votre écran. Chacun peut alors fermer sa fenêtre d\'Assistance à distance.',
]
</script>

<template>
  <div class="help">
    <!-- Bandeau d'en-tête -->
    <header class="help-header">
      <div class="help-title">
        <img src="/xp/start/help.png" alt="" />
        <span>Centre d'aide et de support</span>
      </div>
      <div class="help-search">
        <input type="text" placeholder="Rechercher" />
        <button>Démarrer la recherche</button>
      </div>
    </header>

    <!-- Barre de navigation -->
    <nav class="help-nav">
      <span class="nav-btn disabled">◄ Précédent</span>
      <span class="nav-btn disabled">Suivant ►</span>
      <span class="nav-sep"></span>
      <span class="nav-btn">Accueil</span>
      <span class="nav-btn">Index</span>
      <span class="nav-btn">Favoris</span>
      <span class="nav-btn">Historique</span>
    </nav>

    <div class="help-body">
      <!-- Volet gauche -->
      <aside class="help-side">
        <p class="side-title">Demander de l'assistance</p>
        <a class="side-link active">Inviter un ami avec l'Assistance à distance</a>
        <a class="side-link">Obtenir une assistance Microsoft en ligne</a>
        <p class="side-title">Choisir une rubrique d'aide</p>
        <a class="side-link">Nouveautés de Windows XP</a>
        <a class="side-link">Musique, vidéo, jeux et photos</a>
        <a class="side-link">Connexions réseau et Web</a>
        <a class="side-link">Protection de votre ordinateur</a>
      </aside>

      <!-- Contenu -->
      <article class="help-content">
        <h1>Obtenir de l'aide avec l'Assistance à distance</h1>
        <p>
          Lorsqu'un problème survient sur votre ordinateur, il peut être difficile d'expliquer ce
          qui se passe et de le résoudre au téléphone avec un ami ou un technicien. Windows XP
          propose pour cela l'<b>Assistance à distance</b> : vous pouvez inviter un ami ou un
          technicien à voir votre Bureau et, si nécessaire, à prendre temporairement le contrôle de
          votre clavier et de votre souris via Internet. Vous voyez tout ce qu'il fait, ce qui vous
          permet aussi d'apprendre comment résoudre le problème.
        </p>

        <h2>Pour utiliser l'Assistance à distance</h2>
        <ol class="steps">
          <li v-for="(s, i) in steps" :key="i">{{ s }}</li>
        </ol>

        <p class="note">
          L'Assistance à distance est un moyen rapide d'obtenir de l'aide à distance — et aussi de
          montrer quelque chose à quelqu'un, comme un diaporama de photos ou un nouveau programme.
        </p>

        <p class="source">
          Source :
          <a href="http://www.csgnetwork.com/rdcsupport.html" target="_blank" rel="noreferrer">
            XP Remote Desktop Connection Support — csgnetwork.com
          </a>
        </p>
      </article>
    </div>
  </div>
</template>

<style scoped>
.help {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
  font-family: Tahoma, 'Noto Sans', sans-serif;
  font-size: 12px;
  color: #111;
}

/* En-tête */
.help-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 6px 12px;
  color: #fff;
  background: linear-gradient(180deg, #3f8de8 0%, #1f5fce 55%, #16469f 100%);
  border-bottom: 2px solid #0a347d;
}
.help-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4);
}
.help-title img {
  width: 24px;
  height: 24px;
}
.help-search {
  display: flex;
  align-items: center;
  gap: 4px;
}
.help-search input {
  width: 130px;
  font-size: 12px;
  padding: 2px 4px;
}
.help-search button {
  font-size: 11px;
  padding: 2px 6px;
}

/* Barre de navigation */
.help-nav {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: linear-gradient(180deg, #f6f5ee 0%, #e6e3d8 100%);
  border-bottom: 1px solid #b7b5ad;
  font-size: 12px;
}
.nav-btn {
  padding: 2px 8px;
  border: 1px solid transparent;
  border-radius: 3px;
  color: #16469f;
  cursor: pointer;
}
.nav-btn:hover {
  border-color: rgba(0, 0, 0, 0.15);
  background: rgba(255, 255, 255, 0.6);
}
.nav-btn.disabled {
  color: #999;
  cursor: default;
}
.nav-btn.disabled:hover {
  border-color: transparent;
  background: transparent;
}
.nav-sep {
  width: 1px;
  height: 16px;
  background: #b7b5ad;
  margin: 0 4px;
}

/* Corps deux colonnes */
.help-body {
  flex: 1;
  min-height: 0;
  display: flex;
  overflow: hidden;
}
.help-side {
  width: 210px;
  flex-shrink: 0;
  background: linear-gradient(180deg, #5b86d6 0%, #4a73c8 100%);
  color: #fff;
  padding: 10px 10px;
  overflow: auto;
}
.side-title {
  margin: 8px 0 5px;
  font-weight: bold;
  font-size: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.4);
  padding-bottom: 3px;
}
.side-title:first-child {
  margin-top: 0;
}
.side-link {
  display: block;
  font-size: 12px;
  color: #fff;
  padding: 3px 0;
  cursor: pointer;
}
.side-link:hover {
  text-decoration: underline;
}
.side-link.active {
  font-weight: bold;
  color: #ffe27a;
}

.help-content {
  flex: 1;
  overflow: auto;
  padding: 14px 20px;
}
.help-content h1 {
  font-size: 17px;
  color: #16469f;
  margin: 0 0 10px;
}
.help-content h2 {
  font-size: 14px;
  color: #16469f;
  margin: 16px 0 8px;
}
.help-content p {
  line-height: 1.5;
  margin: 0 0 10px;
}
.steps {
  margin: 0 0 12px;
  padding-left: 22px;
}
.steps li {
  line-height: 1.5;
  margin-bottom: 7px;
}
.note {
  background: #fffbe6;
  border: 1px solid #e3d8a0;
  border-radius: 3px;
  padding: 8px 10px;
}
.source {
  margin-top: 14px;
  font-size: 11px;
  color: #666;
  border-top: 1px solid #ddd;
  padding-top: 8px;
}
.source a {
  color: #16469f;
}
</style>
