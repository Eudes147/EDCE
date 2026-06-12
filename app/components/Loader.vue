<!-- components/Loader.vue -->
<template>
  <div class="min-h-screen flex flex-col justify-center items-center gap-6 p-4 text-center">
    <!-- Texte adaptatif : plus petit sur mobile, taille h1/titre sur desktop -->
    <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-on-surface tracking-tight">
      Chargement des données {{ name }}
    </h1>
    
    <div>
      <!-- SVG adaptatif : w-12/h-12 (~3rem) sur mobile, évoluant vers w-20/h-20 (5rem) sur desktop -->
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24"
        class="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 fill-primary"
      >
        <!-- Icon from Material Line Icons by Vjacheslav Trushkin - https://github.com/cyberalien/line-md/blob/master/license.txt -->
        <g>
          <circle cx="12" cy="3.5" r="1.5">
            <animateTransform attributeName="transform" calcMode="discrete" dur="2.4s" repeatCount="indefinite" type="rotate" values="0 12 12;90 12 12;180 12 12;270 12 12"/>
            <animate attributeName="opacity" dur="0.6s" repeatCount="indefinite" values="1;1;0"/>
          </circle>
          <circle cx="12" cy="3.5" r="1.5" transform="rotate(30 12 12)">
            <animateTransform attributeName="transform" begin="0.2s" calcMode="discrete" dur="2.4s" repeatCount="indefinite" type="rotate" values="30 12 12;120 12 12;210 12 12;300 12 12"/>
            <animate attributeName="opacity" begin="0.2s" dur="0.6s" repeatCount="indefinite" values="1;1;0"/>
          </circle>
          <circle cx="12" cy="3.5" r="1.5" transform="rotate(60 12 12)">
            <animateTransform attributeName="transform" begin="0.4s" calcMode="discrete" dur="2.4s" repeatCount="indefinite" type="rotate" values="60 12 12;150 12 12;240 12 12;330 12 12"/>
            <animate attributeName="opacity" begin="0.4s" dur="0.6s" repeatCount="indefinite" values="1;1;0"/>
          </circle>
        </g>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  name: {
    type: String,
    default: ''
  }
})
</script>