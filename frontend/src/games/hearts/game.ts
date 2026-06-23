import { iframeGame } from '../types'
export default {
  id: 'hearts',
  name: 'Hearts',
  icon: '/xp/winxp-icons/heart.png', // déjà présent dans tes assets
  w: 700,
  h: 560,
  component: iframeGame('/games/hearts/index.html'),
}
