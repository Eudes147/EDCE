// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
      '@nuxtjs/tailwindcss',
      '@nuxtjs/google-fonts',
      '@pinia/nuxt',
      '@nuxt/image',
      '@nuxt/icon',
      '@vueuse/motion/nuxt',
  ],
  css: [
      '~/assets/css/main.css',  
      '~/assets/css/tailwind.css',  
  ],
  $fetch: {
    baseURL: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3000'
  },

  // Configuration du module google-fonts pour des polices locales / téléchargées
  googleFonts: {
    families: {
      Outfit: [300, 400, 500, 600, 700],
      Sora: [300, 400, 500, 600, 700]
    },
    download: true, // Télécharge et enregistre automatiquement les polices dans .nuxt/ pour le build
    inject: true,
    outputDir: 'assets/fonts', // Dossier de build propre
  },

  icon: {
    serverBundle:{
      collections: ['material-symbols','material-symbols-light',],
    },
    clientBundle: {
      collections: ['material-symbols','material-symbols-light',],
      scan:true,
    },
  },
  app: {
    head: {
      title: 'EDCE - Sunday School Management',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
    }
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL,
      motion:{
        directives:{
          "pop-bottom":{
            initial:{
              scale:0, opacity:0, y: -100
            },
            visible: {
              scale: 1, opacity: 1, y:0
            }
          },
        },
      },
    },
  },
  typescript: {
    strict: true,
  },
})