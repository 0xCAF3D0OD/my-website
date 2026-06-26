import { ref } from 'vue'

// État partagé entre la fenêtre principale MSN (liste de contacts) et la fenêtre
// de conversation : l'e-mail saisi à la connexion sert d'identité côté Discord.
export const msnEmail = ref('')

// Webhook Discord : les messages MSN du visiteur y sont relayés.
export const DISCORD_WEBHOOK_URL =
  'https://discord.com/api/webhooks/1520011982940672105/' +
  'BLJ79V7SWAMzMRE_uI7IRQoCjNQUQfGHcXWRg4CJu75KhW78mrfu1keS92PvKJQybf1l'

export const DISCORD_INVITE_URL = 'https://discord.gg'
