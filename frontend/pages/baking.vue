<template>
    <div class="flex flex-col min-h-screen">
      <div class="container mx-auto mt-24 p-6 text-center flex-grow">
        <h2 class="text-3xl font-bold text-center mb-8 text-pink">
          Ingredient Data
        </h2>
  
        <!-- Loader -->
        <div v-if="loading" class="text-center text-lg font-medium">
          Loading ingredient data...
        </div>
  
        <!-- Error Message -->
        <div
          v-if="error"
          class="bg-red-100 text-red-600 p-4 rounded mb-4 text-center"
        >
          <i class="fas fa-exclamation-triangle"></i> {{ error }}
        </div>
  
        <!-- Data List -->
        <div
          v-if="!loading && !error && ingredientData.length > 0"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div
            v-for="item in ingredientData"
            :key="item.id"
            class="card"
          >
            <h3 class="text-xl font-bold mb-1">{{ item.ingredients.name || 'Unknown Ingredient' }}</h3>
            <p><strong>Type:</strong> {{ item.ingredients.type || 'Unknown Type' }}</p>
            <p><strong>Flavor:</strong> {{ item.ingredients.flavor || 'N/A' }}</p>
            <p><strong>Common Uses:</strong> {{ item.ingredients.commonUses?.join(', ') || 'N/A' }}</p>
            <p><strong>Allergen Info:</strong> {{ item.ingredients.allergenInformation || 'None' }}</p>
          </div>
        </div>
  
        <!-- No Data Message -->
        <div
          v-else-if="!loading && !error && ingredientData.length === 0"
          class="text-center text-lg font-medium"
        >
          No ingredient data available.
        </div>
  
        <!-- Pagination Controls -->
        <div class="pagination flex justify-center mt-8">
          <button
            :disabled="currentPage === 1"
            class="px-4 py-2 mx-1 rounded disabled:opacity-50 disabled:cursor-not-allowed w-32"
            @click="fetchIngredientData(currentPage - 1)"
          >
            Previous
          </button>
          <button
            :disabled="currentPage === totalPages"
            class="px-4 py-2 mx-1 rounded disabled:opacity-50 disabled:cursor-not-allowed w-32"
            @click="fetchIngredientData(currentPage + 1)"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
import { ref, onMounted } from 'vue'
import { useFetch } from '#app'

// State variables
const ingredientData = ref([])
const currentPage = ref(1) // Start with the first page
const pageSize = ref(6) // 6 items per page
const totalPages = ref(1)
const error = ref(null)
const loading = ref(false)

// Fetch ingredient data function
async function fetchIngredientData(page) {
  if (page < 1 || (totalPages.value && page > totalPages.value)) return // Prevent out-of-bounds pages

  currentPage.value = page
  loading.value = true
  error.value = null
  ingredientData.value = []

  try {
    const { data, error: fetchError } = await useFetch('/api/baking', {
      params: { page: currentPage.value, pageSize: pageSize.value },
    })

    if (fetchError.value) {
      error.value = `Error fetching ingredient data: ${fetchError.value.message || fetchError.value}`
    } else if (data.value && data.value.ingredientData) {
      ingredientData.value = data.value.ingredientData
      currentPage.value = data.value.currentPage
      totalPages.value = data.value.totalPages
    } else {
      error.value = 'Unexpected response format. Check API response structure.'
    }
  } catch (err) {
    error.value = `Error fetching ingredient data: ${err.message || err}`
  } finally {
    loading.value = false
  }
}

// Fetch initial data on component mount
onMounted(() => {
  fetchIngredientData(currentPage.value)
})
</script>
  
<style scoped>
.card {
  background: #fff8e7; /* Vanilla yellow */
  color: #333; /* Grey text */
  border: 1px solid #ffd1dc; /* Light pink border */
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.1);
}

.card:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 12px rgba(255, 105, 180, 0.3);
}

.pagination button {
  background-color: #ff1493; /* Hard pink */
  color: #fff8e7; /* Vanilla yellow */
  border: 2px solid #ffd1dc; /* Light pink */
  padding: 10px 20px;
  border-radius: 12px;
}

.pagination button:hover {
  background-color: #ffd1dc;
  color: #2f4f4f;
}
</style>
  