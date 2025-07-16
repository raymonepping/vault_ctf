<template>
    <div class="flex flex-col min-h-screen">
      <div class="container mx-auto mt-24 p-6 text-center flex-grow">
        <h2 class="text-3xl font-bold text-center mb-8 text-pink">
          Mastermind - Crack the Vault
        </h2>
  
        <!-- Start Game Form -->
        <div v-if="!gameId" class="card max-w-lg mx-auto">
          <h3 class="text-xl font-semibold mb-4">Start a New Game</h3>
          <input
            v-model="playerName"
            type="text"
            placeholder="Enter your name"
            class="mb-4 p-2 border rounded w-full"
          />
          <button
            @click="startGame"
            class="bg-pink text-white px-4 py-2 rounded hover:scale-105"
          >
            Start Game
          </button>
          <p v-if="error" class="text-red-600 mt-4">{{ error }}</p>
        </div>
  
        <!-- Game Form -->
        <div v-else class="card max-w-lg mx-auto">
          <div class="grid grid-cols-4 gap-2 mb-4">
            <input
              v-for="(digit, index) in codeAttempt"
              :key="index"
              v-model.number="codeAttempt[index]"
              type="number"
              min="0"
              max="9"
              class="w-12 p-2 border rounded text-center"
            />
          </div>
          <button
            v-if="!gameCompleted"
            @click="submitAttempt"
            class="bg-pink text-white px-4 py-2 rounded hover:scale-105"
          >
            Submit Code
          </button>
          <button
            v-else
            @click="restartGame"
            class="bg-green-500 text-white px-4 py-2 rounded hover:scale-105"
          >
            Restart Game
          </button>
          <p v-if="message" class="text-lg font-medium mt-4">{{ message }}</p>
  
          <!-- Previous Attempts Section -->
          <div v-if="attempts.length > 0" class="mt-6">
            <h4 class="text-lg font-semibold mb-4">Previous Attempts</h4>
            <table class="table-auto w-full border-collapse border border-gray-400">
              <thead>
                <tr class="bg-gray-200">
                  <th class="border border-gray-400 px-4 py-2">Attempt #</th>
                  <th class="border border-gray-400 px-4 py-2">Code</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(attempt, index) in attempts" :key="index">
                  <td class="border border-gray-400 px-4 py-2 text-center">{{ index + 1 }}</td>
                  <td class="border border-gray-400 px-4 py-2 text-center">{{ attempt.codeAttempt.join(' ') }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        playerName: "",
        gameId: null,
        codeAttempt: [null, null, null, null],
        message: "",
        attempts: [],
        error: "",
        gameCompleted: false,
      };
    },
    methods: {
      async startGame() {
        this.error = "";
        try {
          const response = await $fetch("/api/gaming/start", {
            method: "POST",
            body: { playerName: this.playerName },
          });
          this.gameId = response.gameId;
          this.message = response.message;
          this.gameCompleted = false; // Reset game state
          this.attempts = [];
          this.codeAttempt = [null, null, null, null];
        } catch (err) {
          this.error = err.data?.message || "Error starting game.";
        }
      },
      async submitAttempt() {
        this.error = "";
        try {
          const response = await $fetch("/api/gaming/attempt", {
            method: "POST",
            body: {
              gameId: this.gameId,
              codeAttempt: this.codeAttempt,
            },
          });
  
          // Update message and only push the attempt code
          this.message = response.message;
          this.attempts.push({
            codeAttempt: [...this.codeAttempt], // Add the current code attempt
          });
  
          // Check if the game is completed
          if (response.message.includes("Congratulations")) {
            this.gameCompleted = true;
          }
        } catch (err) {
          this.error = err.data?.message || "Error submitting attempt.";
        }
      },
      restartGame() {
        // Reset all state variables
        this.playerName = "";
        this.gameId = null;
        this.codeAttempt = [null, null, null, null];
        this.message = "";
        this.attempts = [];
        this.error = "";
        this.gameCompleted = false;
      },
    },
  };
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
  
  button {
    background-color: #ff1493; /* Hard pink */
    color: #fff8e7; /* Vanilla yellow */
    border: 2px solid #ffd1dc; /* Light pink */
    padding: 10px 20px;
    border-radius: 12px;
    transition: transform 0.2s ease-in-out;
  }
  
  button:hover {
    background-color: #ffd1dc;
    color: #2f4f4f;
  }
  
  input {
    font-size: 1.25rem;
    text-align: center;
    border: 1px solid #ffd1dc; /* Light pink */
    border-radius: 8px;
    padding: 0.5rem;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th,
  td {
    text-align: center;
    padding: 8px;
    border: 1px solid #ddd;
  }
  
  th {
    background-color: #f2f2f2;
  }
  </style>
  