export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  plugins: ['~/plugins/auth-init.js'],
  devServer: {
    port: 8075,
    host: '0.0.0.0',
  },

  app: {
    head: {
      title: 'Flour', // Default title for all pages
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: '' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { 
          rel: 'stylesheet', 
          href: 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;600&display=swap' 
        } // Import Dancing Script font
      ],
    },
  },
  
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],

  tailwindcss: {
    // Tailwind CSS configuration options
  },
  
  css: [
    '@/assets/css/tailwind.css',
    '@fortawesome/fontawesome-free/css/all.css',
  ],  

  ssr: false, // Disable server-side rendering (SPA mode)

  router: {
    middleware: ['auth'], // Apply the auth middleware globally
  },  

  // Use Nitro's 'routeRules' to set up the proxy instead
  nitro: {
    routeRules: {
      '/api/**': {
        proxy: 'http://butter:3000/api/**',
      },
    },
  },

  // Adjusted runtimeConfig
  runtimeConfig: {
    public: {
      baseUrl: '', // Use empty string to make API calls relative to the Nuxt server
    },
  },  

  pinia: {
    autoImports: [
      'defineStore',
      'storeToRefs',
    ],
  },
});
