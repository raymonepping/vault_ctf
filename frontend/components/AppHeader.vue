<template>
  <header
    class="bg-gradient-to-tr from-lightpink via-pink to-deeppink text-white py-4 shadow-md fixed w-full top-0 z-50"
  >
    <div class="container mx-auto flex justify-between items-center h-full">
      <!-- Title on the Left -->
      <div class="flex flex-grow items-center justify-start h-full">
        <h1
          class="text-2xl font-bold flex items-center justify-center h-full text-darkgrey custom-header-font"
        >
          the Bakeray
        </h1>
      </div>

      <!-- Navigation Links on the Right -->
      <div class="flex space-x-6 items-center">
        <nav class="flex space-x-6">
          <NuxtLink
            to="/"
            class="transition duration-300 ease-in-out hover:font-bold hover:text-lg text-vanillayellow"
            >Home</NuxtLink
          >
          <NuxtLink
            to="/baking"
            class="transition duration-300 ease-in-out hover:font-bold hover:text-lg text-vanillayellow"
            >Ingredients</NuxtLink
          >
        </nav>
      </div>
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

function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value
}
</script>

<style scoped>
header {
  background: linear-gradient(
    to right,
    #ffd1dc, /* Light pink */
    #ff69b4, /* Hot pink */
    #ff1493 /* Deep pink */
  );
}

h1 {
  color: #2f4f4f; /* Dark grey */
}

/* Add the Dancing Script font for the Bakeray header */
.custom-header-font {
  font-family: 'Dancing Script', cursive;
  font-size: 2.5rem; /* Slightly larger font size for better visibility */
  font-weight: 600; /* Medium weight for elegant appearance */
}

nav a {
  color: #fff8e7; /* Vanilla yellow */
  transition: color 0.3s ease-in-out;
}
nav a:hover {
  color: #ffd1dc; /* Light pink */
}
</style>
