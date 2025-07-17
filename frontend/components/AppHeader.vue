<template>
  <header
    class="bg-gradient-to-tr from-black via-neutral-900 to-zinc-800 text-yellow-400 py-4 shadow-md fixed w-full top-0 z-50"
  >
    <div class="container mx-auto flex justify-between items-center h-full">
      <!-- Logo and Title on the Left -->
      <div class="flex items-center space-x-4">
        <img
          src="/vault_on-dark.svg"
          alt="Vault Radar Logo"
          class="h-[1cm] w-auto max-h-24 mr-2"
        />
        <span class="text-lg font-bold custom-header-font">Vault Radar</span>
        <h1
          class="text-2xl font-bold custom-header-font"
        >
          Vault Radar CTF
        </h1>
      </div>

      <!-- Navigation on the Right -->
      <nav class="flex space-x-6 items-center">
        <NuxtLink
          to="/"
          class="hover:text-yellow-200 transition duration-300"
        >Home</NuxtLink>
        <NuxtLink
          to="/baking"
          class="hover:text-yellow-200 transition duration-300"
        >Challenges</NuxtLink>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { storeToRefs } from 'pinia'

const isCollapsed = ref(false)
const authStore = useAuthStore()
const { isAuthenticated, currentUser } = storeToRefs(authStore)

const isAdmin = computed(() => {
  return currentUser.value?.roles?.includes('admin') || false
})
</script>

<style scoped>
.custom-header-font {
  font-family: 'Orbitron', sans-serif;
  letter-spacing: 0.05em;
  text-shadow: 1px 1px 2px black;
}
</style>
