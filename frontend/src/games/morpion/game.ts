import type { GameDef } from '../types'
import Morpion from './Morpion.vue'

const game: GameDef = {
  id: 'morpion',
  name: 'Morpion',
  icon: '/xp/icons/morpion.svg',
  w: 300,
  h: 350,
  component: Morpion,
  rules: {
    title: 'Règles du Morpion',
    intro:
      'Aligne trois de tes symboles — horizontalement, verticalement ou en diagonale — avant l’ordinateur.',
    sections: [
      {
        heading: 'Jouer',
        lines: [
          'Tu joues les X, l’ordinateur joue les O.',
          'C’est toi qui commences : clique sur une case vide pour y poser un X.',
          'L’ordinateur répond aussitôt en posant un O.',
        ],
      },
      {
        heading: 'Gagner',
        lines: [
          'Le premier à aligner trois symboles l’emporte.',
          'Si la grille se remplit sans alignement, c’est match nul.',
          'L’ordinateur gagne s’il le peut, sinon il bloque ton alignement.',
          '« Nouvelle partie » remet la grille à zéro.',
        ],
      },
    ],
  },
}
export default game
