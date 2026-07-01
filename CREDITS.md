# Portfolio « Windows XP » — Journal & Crédits

Ce document récapitule les fonctionnalités développées sur le bureau façon Windows XP
(front-end Vue 3 + Vite dans `frontend/`), ainsi que **toutes les sources** utilisées :
dépôts GitHub réutilisés, dépôts consultés en référence, bibliothèques, services et
packs d'icônes.

> Distinction importante ci-dessous :
> **[Réutilisé]** = du code ou des assets ont été intégrés au projet.
> **[Référence]** = seulement consulté pour comprendre la structure / le design, rien
> copié directement.

---

## 1. Fonctionnalités développées

### Bureau & fenêtres
- **Bouton d'aide « ? » façon XP** au-dessus de chaque jeu, ouvrant les règles dans une
  boîte de dialogue XP (barre de titre Luna, vrai bouton de fermeture rouge).
- **Explorer générique navigable** : le Poste de travail et chaque dossier (Projets, C:)
  partagent le même composant récursif (Précédent / Dossier parent, barre d'adresse
  `C:\…`, titre de fenêtre dynamique). Modèle inspiré du système de fichiers de RebornXP.
- **Bloc-notes fonctionnel** : vraie zone de texte + menus déroulants (Sélectionner tout,
  Copier/Couper, Heure/Date, retour à la ligne…), barre d'état `Ln/Col`.
- **Correctif mise en veille** : l'économiseur d'écran ne se déclenche plus pendant qu'on
  joue (les jeux tournent en iframe ; on écoute désormais l'activité à l'intérieur).

### Jeux
- **Solitaire** : suppression du cadre interne redondant, correction du débordement des
  cartes, bouton « New game » remonté dans le bandeau XP.

### Outlook Express (formulaire de contact)
- Refonte fidèle : **vraies icônes Outlook Express** (Envoyer, Couper, Copier, Coller,
  Annuler, Joindre) et **barre de mise en forme fonctionnelle** (police, taille via
  comboboxes XP, gras/italique/souligné, couleur, listes, retrait, alignement, trait),
  **compteur de caractères**.

### Winamp
- **Webamp** intégré, accessible depuis le menu Démarrer (absent du bureau).
- **Sans cadre XP** : le skin Winamp flotte librement (monté directement dans la page,
  déplaçable/redimensionnable partout, zones vides cliquables au travers).
- **Visualiseur Milkdrop** (Butterchurn) activé.

### MSN Messenger (relié à un webhook Discord)
- **Fenêtre principale** : connexion → liste de contacts (identité en ligne, E-mail /
  MSN Aujourd'hui, « Ajouter un contact », barre de recherche, bandeau `.net`).
- **Fenêtre de conversation** : barre d'outils (Inviter / Envoyer des fichiers / Webcam /
  Audio / Activités / Jeux), destinataire, bandeau d'info, images d'affichage (contact en
  haut, expéditeur en bas), barre de format (Police / Émoticône / Clins d'œil / Fonds),
  saisie + boutons Envoyer / Rechercher, onglets Manuscrit / Clavier.
- **Émoticônes MSN authentiques** : 80 bitmaps Microsoft d'origine (convertis en PNG) +
  ~39 raccourcis classiques (`:)`, `(L)`, `(Y)`, `:D`…) rendus en images inline.
- Les messages envoyés sont relayés vers un **salon Discord** (webhook).

---

## 2. Dépôts GitHub utilisés comme modèle ou source

| Projet | Rôle | Ce qu'on en a tiré |
|---|---|---|
| **msnchat-rs** (fourni : `msn-emoticone.zip`) | [Réutilisé] | Les **80 émoticônes MSN authentiques** (bitmaps Microsoft `BITMAP*.bmp`, convertis en PNG → `public/xp/msn/emoticons/`). |
| **modernlivemessenger.com.br** (fourni : `modernlivemessenger.com.br-main.zip`) — clone web MSN (Vite + 7.css) | [Réutilisé] | Les **vraies icônes** de la conversation MSN : barre de format (`change_font`, `select_emoticon`, `select_wink`, `select_background`, `send_nudge`, `editortab`, `arrow`) et barre d'outils (Inviter, Envoyer des fichiers, Webcam, Audio, Activités, Jeux) → `public/xp/msn/chat/`. Structure de la zone d'écriture aussi inspirée de ce dépôt. |
| **react-xp** — <https://github.com/Cyanoxide/react-xp> (fourni : `react-xp-main.zip`) | [Référence] | Bureau XP en React. **Pas de composant MSN** : conservé comme référence pour de futures améliorations (composants génériques `XPScrollbars`, `WindowMenu`, `Window`, `Login`). |
| **msn-chatbot** (fourni : `msn-chatbot-main.zip`) — backend **Elixir** reliant un vrai client MSN 8.5 (escargot.chat) à ChatGPT | [Référence] | Aucune interface web ; ses captures d'écran ont servi à comprendre la structure de la fenêtre de conversation MSN. |
| **RebornXP / BINX-XPerience** — <https://github.com/Binxy111/BINX-XPerience> | [Référence] | Étudié en amont pour comprendre l'organisation « bureau XP dans le navigateur » (système de fichiers en arbre, Explorer générique, dossiers = My Computer). A inspiré notre Explorer/dossiers, sans copie de code. |

---

## 3. Bibliothèques & services externes

| Nom | Usage | Lien / licence |
|---|---|---|
| **Webamp** | Lecteur Winamp (chargé via CDN unpkg `webamp@1.5.0`) | <https://github.com/captbaritone/webamp> — MIT |
| **Butterchurn** + **butterchurn-presets** | Visualiseur Milkdrop de Winamp (CDN unpkg) | <https://github.com/jberg/butterchurn> — MIT |
| **Web3Forms** | Envoi du formulaire de contact (Outlook Express) par e-mail | <https://web3forms.com> |
| **Webhook Discord** | Relaye les messages MSN du visiteur vers un salon Discord | — |

---

## 4. Jeux intégrés (iframes statiques dans `public/games/`)

| Jeu | Source |
|---|---|
| **Solitaire** | js-solitaire (uzi88) — clone Klondike en JS |
| **Hearts** | Hearts with HTML5 (yjyao) |
| **Pinball** | 3D Pinball Space Cadet (portage web) |
| **Démineur** | implémentation maison (variante « quiz ») |
| **Morpion** | composant Vue maison |

---

## 5. Icônes & assets Windows XP

- Packs d'icônes XP servis depuis `public/xp/` : **WindowsXPIconsSVG**, `winxp-icons`,
  `windowsIcons`, etc. (icônes authentiques shell32 / msgsres).
- Icône Winamp : `public/xp/winxp-icons/winamp.png`.
- Émoticônes MSN : `public/xp/msn/emoticons/` (80 fichiers).
- Icônes de conversation MSN : `public/xp/msn/chat/` (barre de format + toolbar).

---

## 6. Note sur les licences

Les émoticônes MSN, icônes MSN/Windows et sons sont des **assets Microsoft d'origine**,
réutilisés ici dans un cadre **nostalgique / éducatif** (recréation de l'interface
Windows XP). Webamp et Butterchurn sont sous licence **MIT**. Merci aux auteurs des
dépôts cités ci-dessus, qui ont grandement facilité ce travail.
