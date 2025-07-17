<template>
  <div class="container mx-auto mt-20 p-6 text-center flex-grow">
    <!-- Hero Title -->
    <h1 class="text-4xl md:text-5xl font-bold text-yellow-400 mb-6 drop-shadow">
      Vault Radar CTF
    </h1>

    <!-- Intro Box -->
    <div class="bg-black text-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <p class="text-lg leading-relaxed">
        Welcome, challenger. Your objective: solve all 10 levels before time runs out.
        <br />
        Prove your skills. Defend the vault. Become the Guardian of the Galaxy.
      </p>
    </div>


    <!-- Status Tip -->
    <p class="text-sm mt-6 text-gray-400">
      🚀 This is the start page. Try <code>/health</code> or <code>/game</code> to begin your journey.
    </p>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default',
})
</script>

<style scoped>
h1 {
  font-family: 'Orbitron', sans-serif;
  letter-spacing: 1px;
}

.container {
  animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
