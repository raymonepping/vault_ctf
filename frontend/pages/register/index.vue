<template>
  <div class="max-w-md mx-auto p-6 mt-20 bg-white rounded-2xl shadow-2xl border border-gray-200">
    <h2 class="text-3xl font-bold mb-6 text-center text-gray-800">Register for Vault CTF</h2>
    <form @submit.prevent="registerPlayer">
      <div class="mb-4">
        <label for="username" class="block font-semibold text-gray-700 mb-1">Username</label>
        <input
          v-model="username"
          id="username"
          type="text"
          required
          placeholder="Enter a unique player name"
          class="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        class="w-full py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-60"
        :disabled="loading"
      >
        {{ loading ? 'Registering...' : 'Register' }}
      </button>

      <div v-if="message" class="mt-4 text-green-700 font-semibold">{{ message }}</div>
      <div v-if="error" class="mt-4 text-red-600 font-semibold">{{ error }}</div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { usePlayerStore } from '~/stores/player'
import { useRouter } from 'vue-router'

const username = ref('')
const message = ref('')
const error = ref('')
const router = useRouter()
const playerStore = usePlayerStore()

const registerPlayer = async () => {
  message.value = ''
  error.value = ''

  console.log('[REGISTER] Starting registration for:', username.value)

  try {
    const payload = {
      username: username.value,
      type: 'player',
      currentLevel: 1,
      keysLeft: 3,
      levelsCompleted: [],
      hintsUsed: {},
      validateHistory: [],
      badgeStatus: false,
      startTime: new Date().toISOString(),
      levelStartTime: new Date().toISOString(),
      totalElapsedSeconds: 0
    }

    console.log('[REGISTER] Payload being sent to backend:', payload)

    const res = await $fetch('/api/player', {
      method: 'POST',
      body: payload
    })

    console.log('[REGISTER] Backend response:', res)

    if (res) {
      message.value = `Registration successful! Welcome, ${username.value}.`

      if (localStorage.getItem('ctf_player')) {
        console.log('[REGISTER] Clearing existing ctf_player localStorage entry')
        localStorage.removeItem('ctf_player')
      }

      localStorage.setItem('ctf_player', username.value)
      console.log('[REGISTER] New player saved in localStorage:', username.value)

      playerStore.player = res // ✅ Fixed
      playerStore.startTimer(res.levelStartTime)

      console.log('[REGISTER] Redirecting to /levels/1')
      setTimeout(() => {
        router.push('/levels/1')
      }, 800)
    }
  } catch (err) {
    console.error('[REGISTER] Error during registration:', err)
    error.value = err?.data?.error || 'Registration failed. Try another username.'
  }
}
</script>
