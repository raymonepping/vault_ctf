<template>
  <div class="mt-24 p-4 text-white">
    <h2 class="text-2xl font-bold mb-2">Backend Check</h2>
    <p v-if="error" class="text-red-400">❌ Error: {{ error }}</p>
    <p v-else-if="data" class="text-green-400">✅ Response: {{ data.message }}</p>
    <p v-else class="text-yellow-300">⌛ Loading...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const data = ref(null)
const error = ref(null)

onMounted(async () => {
  try {
    const res = await fetch('/api/ping')
    if (!res.ok) throw new Error('Failed to fetch')
    data.value = await res.json()
  } catch (err) {
    error.value = err.message
  }
})
</script>
