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
      '@nuxtjs/supabase', // <-- Ajout indispensable du module Supabase officiel
  ],
  css: [
      '~/assets/css/main.css',  
      '~/assets/css/tailwind.css',  
  ],

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
    basicAuthUser: '', // Valeur par défaut vide, surchargée par le .env
    basicAuthPass: '',
    public: {
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
  supabase: {
    // Options de configuration du module Supabase si nécessaire (redirige automatiquement vers le .env)
    redirect: false // On gère les redirections manuellement via le store / middleware si besoin
  },
  typescript: {
    strict: true,
  },
})