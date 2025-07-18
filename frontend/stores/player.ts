// stores/player.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePlayerStore = defineStore('player', () => {
  const player = ref(null as any)
  const isLoading = ref(false)
  const error = ref(null as any)

  // === Level Timer ===
  const levelStartTime = ref('')
  const remainingSeconds = ref(0)
  const isTimerRunning = ref(false)

  const timerDisplay = computed(() => {
    const m = Math.floor(remainingSeconds.value / 60)
    const s = remainingSeconds.value % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  })

  let timerInterval: ReturnType<typeof setInterval> | null = null

  function startTimer(startTimeStr: string, maxSeconds = 300) {
    levelStartTime.value = startTimeStr
    const start = new Date(startTimeStr).getTime()
    const now = Date.now()
    const elapsed = Math.floor((now - start) / 1000)
    remainingSeconds.value = Math.max(0, maxSeconds - elapsed)

    if (timerInterval) clearInterval(timerInterval)

    timerInterval = setInterval(() => {
      if (remainingSeconds.value > 0) {
        remainingSeconds.value--
        isTimerRunning.value = true
      } else {
        stopTimer()
      }
    }, 1000)
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
      isTimerRunning.value = false
    }
  }

  // === Game Timer ===
  const gameStartTime = ref('')
  const gameRemainingSeconds = ref(0)
  const isGameRunning = ref(false)

  const gameTimerDisplay = computed(() => {
    const m = Math.floor(gameRemainingSeconds.value / 60)
    const s = gameRemainingSeconds.value % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  })

  let gameTimerInterval: ReturnType<typeof setInterval> | null = null

  function startGameTimer(startTimeStr: string, maxSeconds = 3600) {
    gameStartTime.value = startTimeStr
    const start = new Date(startTimeStr).getTime()
    const now = Date.now()
    const elapsed = Math.floor((now - start) / 1000)
    gameRemainingSeconds.value = Math.max(0, maxSeconds - elapsed)

    if (gameTimerInterval) clearInterval(gameTimerInterval)

    gameTimerInterval = setInterval(() => {
      if (gameRemainingSeconds.value > 0) {
        gameRemainingSeconds.value--
        isGameRunning.value = true
      } else {
        stopGameTimer()
      }
    }, 1000)
  }

  function stopGameTimer() {
    if (gameTimerInterval) {
      clearInterval(gameTimerInterval)
      gameTimerInterval = null
      isGameRunning.value = false
    }
  }

  return {
    // Player state
    player,
    isLoading,
    error,

    // Level timer
    levelStartTime,
    remainingSeconds,
    isTimerRunning,
    timerDisplay,
    startTimer,
    stopTimer,

    // Game timer
    gameStartTime,
    gameRemainingSeconds,
    isGameRunning,
    gameTimerDisplay,
    startGameTimer,
    stopGameTimer,
  }
})
