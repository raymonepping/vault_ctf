// tailwind.config.js
module.exports = {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',                       // Root Vue file
    './composables/**/*.{js,ts}',      // Global composables
    './nuxt.config.{js,ts}',           // Nuxt config for dynamic classes
    './assets/**/*.{css,scss}',        // Global assets
  ],
  theme: {
    extend: {
      colors: {
        brightred: '#ec1018', // Bright Red
        primary: '#d72b3f', // Couchbase red
        darkred: '#be0000', // Dark Red

        brightpurple: '#6241ff', // Bright Purple
        secondary: '#6644fe', // Directus purple
        darkpurple: '#4e00c8', // Dark Purple

        black: '#121212', // Black
        dark: '#1a1a1a', // Dark gray/black
        light: '#ffffff', // White
        yellow: '#fef1db', // Yellow
        orange: '#fd9b0b', // Orange
        customText: '#222220', // Custom dark gray
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // Make sure this is the correct path and format
  ],
}
