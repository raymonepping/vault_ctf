<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50">
    <div class="max-w-xl w-full p-8 rounded-2xl bg-white shadow-2xl border border-gray-100">
      <!-- Alerts -->
      <div v-if="validationStatus === 'success'" class="mb-4 p-3 rounded-lg bg-green-50 border border-green-400 text-green-800 font-semibold animate-fadein">
        ✅ {{ message }}
      </div>
      <div v-if="validationStatus === 'error'" class="mb-4 p-3 rounded-lg bg-red-50 border border-red-400 text-red-700 font-semibold animate-fadein">
        ❌ {{ error }}
      </div>
      <div v-if="backendHealthy" class="mb-4 p-2 rounded bg-green-100 text-green-700 text-sm font-bold">✔ Backend is healthy!</div>
      <div v-else-if="restarting" class="mb-4 p-2 rounded bg-yellow-100 text-yellow-800 text-sm font-bold">⏳ Restarting backend...</div>

      <h2 class="text-2xl font-bold mb-4">Level 3: 🗝️ Seeker of Secrets</h2>
      <p class="mb-4 text-base">
        🔐 There is a hardcoded API key in the backend code.<br>
        <span class="text-gray-600">
          Find and remove it, update the code to fetch the secret from Vault, then click Validate!
        </span>
      </p>

      <div class="mb-2">Current Player: <span class="font-mono">{{ player?.username }}</span></div>
      <div class="mb-2">Current Level: <span class="font-mono">{{ player?.currentLevel }}</span></div>
      <div class="mb-2">Keys Left: <span class="font-mono">{{ player?.keysLeft }}</span></div>
      <div class="mb-2">⏱️ Level Time Left: <span class="font-mono">{{ timerDisplay }}</span></div>
      <div class="mb-6">⌛ Game Time Left: <span class="font-mono">{{ gameTimerDisplay }}</span></div>

      <div class="flex items-center mb-6">
        <button
          :disabled="restarting"
          :class="[
            'bg-teal-500 text-white px-4 py-2 rounded font-bold shadow transition hover:bg-teal-600 disabled:opacity-70 border border-teal-700',
            !restarting ? 'animate-pulse' : ''
          ]"
          @click="restartBackend"
        >
          <span v-if="restarting">Restarting...</span>
          <span v-else>Rebuild/Restart Backend</span>
        </button>
      </div>

      <button
        :disabled="!backendHealthy"
        class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        @click="validateLevel"
      >
        Validate
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePlayerStore } from '~/stores/player'
import { storeToRefs } from 'pinia'

const router = useRouter()
const playerStore = usePlayerStore()
const {
  player,
  timerDisplay,
  gameTimerDisplay
} = storeToRefs(playerStore)

const {
  startTimer,
  stopTimer,
  startGameTimer,
  stopGameTimer
} = playerStore

const message = ref('')
const error = ref('')
const validationStatus = ref(null)
const restarting = ref(false)
const backendHealthy = ref(false)

onMounted(async () => {
  const storedUsername = localStorage.getItem('ctf_player')
  if (!storedUsername) {
    error.value = 'No registered player found. Please register first.'
    return router.push('/register')
  }

  try {
    const data = await $fetch(`/api/player/${storedUsername}`)
    player.value = data
    startTimer(data.levelStartTime || new Date().toISOString())
    startGameTimer(data.startTime || new Date().toISOString())
  } catch {
    const now = new Date().toISOString()
    player.value = {
      username: 'unknown',
      currentLevel: 1,
      keysLeft: 3,
      levelStartTime: now,
      startTime: now
    }
    startTimer(now)
    startGameTimer(now)
  }

  await checkBackendHealth()
})

onUnmounted(() => {
  stopTimer()
  stopGameTimer()
})

async function checkBackendHealth() {
  try {
    await $fetch('/api/health')
    backendHealthy.value = true
  } catch {
    backendHealthy.value = false
  }
}

const restartBackend = async () => {
  restarting.value = true
  backendHealthy.value = false
  message.value = ''
  error.value = ''
  validationStatus.value = null
  try {
    await $fetch('http://localhost:3999/restart-backend', { method: 'POST' })
    for (let i = 0; i < 40; i++) {
      try {
        await $fetch('/api/health')
        backendHealthy.value = true
        restarting.value = false
        return
      } catch {
        await new Promise(r => setTimeout(r, 500))
      }
    }
    restarting.value = false
    backendHealthy.value = false
    error.value = 'Backend failed to start after rebuild.'
    validationStatus.value = 'error'
  } catch {
    restarting.value = false
    backendHealthy.value = false
    error.value = 'Failed to restart backend.'
    validationStatus.value = 'error'
  }
}

const validateLevel = async () => {
  message.value = ''
  error.value = ''
  validationStatus.value = null
  try {
    const username = player.value.username
    const res = await $fetch('/api/validate', {
      method: 'POST',
      body: { username, level: 3 }
    })
    if (res.success) {
      message.value = 'Level 3 complete! 🎉 Proceeding to Level 4...'
      validationStatus.value = 'success'
      setTimeout(() => {
        router.push('/levels/4')
      }, 1500)
    } else {
      error.value = res.message || 'Validation failed.'
      validationStatus.value = 'error'
    }
  } catch (err) {
    error.value = err?.data?.error || 'Validation failed.'
    validationStatus.value = 'error'
  }
}
</script>

<style>
@keyframes fadein {
  0% { opacity: 0; transform: translateY(-8px);}
  100% { opacity: 1; transform: translateY(0);}
}
.animate-fadein {
  animation: fadein 0.4s;
}
</style>
