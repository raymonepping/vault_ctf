<template>
  <header
    class="bg-gradient-to-tr from-black via-neutral-900 to-zinc-800 text-white py-4 shadow-md fixed w-full top-0 z-50"
  >
    <div class="container mx-auto flex justify-between items-center h-full">
  <!-- Logo and Title on the Left -->
      <div class="flex items-center space-x-4 text-lg font-bold custom-header-font">
        <img
          src="/vault_on-dark.svg"
          alt="Vault Radar Logo"
          class="h-[1cm] w-auto max-h-24 mr-2"
        />
        <span>Welcome to HashiCorp Vault - Capture the Flag</span>
      </div>


      <!-- Navigation on the Right -->
      <nav class="flex space-x-6 items-center">
        <NuxtLink
          to="/"
          class="hover:text-gray-300 transition duration-300"
        >Home</NuxtLink>
        <NuxtLink
          to="/levels/1"
          class="hover:text-gray-300 transition duration-300"
        >Challenges</NuxtLink>
      </nav>
    </div>
  </header>
</template>


<style scoped>
.custom-header-font {
  font-family: 'Orbitron', sans-serif;
  letter-spacing: 0.05em;
  text-shadow: 1px 1px 2px black;
}
</style>
