<template>
  <div class="container mx-auto mt-24 p-6 text-center flex-grow">
    <!-- Hero Section -->
    <h1 class="text-4xl md:text-5xl font-bold text-black text-center mb-8">
      Welcome!
    </h1>

    <!-- Content Box -->
    <div
      class="flex flex-col items-center justify-start bg-gray-100 text-gray-900 rounded-lg shadow-lg p-8 max-w-lg mx-auto"
    >
      <!-- Centered Image -->
      <img
        src="../assets/index-image.jpeg"
        alt="Welcome to the Bakeray"
        class="w-64 h-64 object-cover rounded-full shadow-md mb-6"
      />

      <!-- Description -->
      <p class="text-lg md:text-xl text-gray-700 mt-4 leading-relaxed">
        Discover the sweetest ingredients and recipes for your baking journey!
      </p>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default',
})
</script>

<style scoped>
/* Image Styling */
img {
  border: 6px solid #ffd1dc; /* Light pink border */
}

/* Hero Text Styling */
h1 {
  font-family: 'Dancing Script', cursive;
  color: #ff69b4; /* Hot pink */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

/* Adjust spacing for larger screens */
@media (min-width: 768px) {
  .container {
    padding: 8rem;
  }
}
</style>
