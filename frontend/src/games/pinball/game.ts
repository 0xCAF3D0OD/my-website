import { iframeGame } from '../types'
export default {
  id: 'pinball',
  name: 'Pinball',
  icon: '/xp/winxp-icons/pinball.png',
  w: 700,
  h: 560,
  component: iframeGame('/games/pinball/index.html'),
}
