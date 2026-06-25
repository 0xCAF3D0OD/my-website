import type { GameDef } from '../types'
import MinesweeperApp from '../../desktop/apps/MinesweeperApp.vue'

const game: GameDef = {
  id: 'minesweeper',
  name: 'Démineur',
  icon: '/xp/icons/mine-icon.png',
  w: 264,
  h: 350,
  component: MinesweeperApp,
  rules: {
    title: 'Règles du Démineur',
    intro:
      'Le but est de découvrir toutes les cases qui ne cachent pas de mine, le plus vite possible.',
    sections: [
      {
        heading: 'Jouer',
        lines: [
          'Clic gauche : révéler une case.',
          'Un chiffre indique le nombre de mines situées dans les 8 cases voisines.',
          'Clic droit : poser (ou retirer) un drapeau sur une case suspectée.',
        ],
      },
      {
        heading: 'La particularité « Connais-tu Kevin ? »',
        lines: [
          'Si tu cliques sur une mine, un quiz s\'affiche au lieu de perdre directement.',
          'Bonne réponse : la mine est désamorcée et la partie continue.',
          'Mauvaise réponse : c\'est perdu.',
        ],
      },
      {
        heading: 'Gagner',
        lines: [
          'Révéler toutes les cases sans mine.',
          'Le bouton souriant relance une partie ; le menu « Jeu » change la difficulté.',
        ],
      },
    ],
  },
}
export default game
