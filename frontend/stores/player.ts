// stores/player.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePlayerStore = defineStore('player', () => {
  const username = ref('')
  const currentLevel = ref(1)
  const keysLeft = ref(3)

  function setPlayer(data) {
    username.value = data.username
    currentLevel.value = data.currentLevel
    keysLeft.value = data.keysLeft
  }

  return { username, currentLevel, keysLeft, setPlayer }
})
