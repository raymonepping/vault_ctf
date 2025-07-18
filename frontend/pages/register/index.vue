<template>
  <div class="max-w-md mx-auto p-6 mt-12 bg-white rounded-2xl shadow-2xl">
    <h2 class="text-2xl font-bold mb-6 text-center">Register for Vault CTF</h2>
    <form @submit.prevent="registerPlayer">
      <div class="mb-4">
        <label for="username" class="block font-semibold mb-1">Username</label>
        <input v-model="username" id="username" type="text" required class="w-full border p-2 rounded-lg" />
      </div>
      <button type="submit" class="w-full py-2 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition">Register</button>
      <div v-if="message" class="mt-4 text-green-700 font-semibold">{{ message }}</div>
      <div v-if="error" class="mt-4 text-red-600 font-semibold">{{ error }}</div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const message = ref('')
const error = ref('')

const registerPlayer = async () => {
  message.value = ''
  error.value = ''
  try {
    await $fetch('/api/player', {
      method: 'POST',
      body: {
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
    })
    localStorage.setItem('ctf_player', username.value)
    message.value = 'Registration successful! Redirecting...'
    setTimeout(() => {
      router.push('/levels/1')
    }, 1000)
  } catch (err) {
    error.value = err?.data?.error || 'Registration failed. Try another username.'
  }
}
</script>
