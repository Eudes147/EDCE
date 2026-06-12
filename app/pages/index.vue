<template>
  <div class="min-h-screen bg-background text-on-surface font-body">
    <nav class="flex justify-between items-center px-4 md:px-margin-desktop py-md border-b border-outline-variant bg-background sticky top-0 z-50">
      <h1 class="font-h2 text-primary font-bold">EDCE</h1>
      <div class="flex items-center gap-2 sm:gap-3">
        <button 
          @click="navigateTo('/register')" 
          class="bg-transparent text-primary border border-primary px-3 py-2 sm:px-6 rounded-lg font-label-md hover:bg-primary/5 hover:scale-95 transition-all text-sm sm:text-base"
        >
          Créer un compte
        </button>
        <button 
          @click="navigateTo('/login')" 
          class="bg-primary text-white px-3 py-2 sm:px-6 rounded-lg font-label-md hover:scale-95 transition-all text-sm sm:text-base"
        >
          Se Connecter
        </button>
      </div>
    </nav>

    <header class="py-xl px-4 md:px-margin-desktop text-center">
      <h2 class="font-h1 text-3xl md:text-[3rem] font-bold text-primary mb-4 leading-tight">
        Gerez votre école du dimanche avec <span class="text-secondary">excellence</span>
      </h2>
      <p class="font-body-lg text-on-surface-variant max-w-2xl mx-auto mb-lg text-sm sm:text-base">
        La plateforme tout-en-un pour organiser les enseignements, suivre le parcours spirituel des enfants et simplifier la gestion quotidienne pour vos moniteurs.
      </p>
      <div class="flex flex-col sm:flex-row justify-center gap-4 px-4 sm:px-0">
        <button class="bg-primary text-white px-8 py-4 rounded-xl font-label-md ultra-shadow w-full sm:w-auto">
          Commencer maintenant
        </button>
        <button class="bg-surface-container text-on-surface px-8 py-4 rounded-xl font-label-md w-full sm:w-auto">
          Voir les fonctionnalités
        </button>
      </div>
    </header>

    <section class="px-4 md:px-margin-desktop py-xl bg-surface-container-lowest">
      <h3 class="font-h2 text-center mb-xl text-2xl md:text-3xl">Pourquoi nous choisir ?</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-lg">
        <div class="glass-card p-lg text-center ultra-shadow">
          <Icon name="groups" color="text-primary text-[3rem] mb-4" />
          <h4 class="font-h3 mb-2">Gestion Simplifiée</h4>
          <p class="text-on-surface-variant">Centralisez toutes les informations de vos enfants et moniteurs dans une interface intuitive.</p>
        </div>
        <div class="glass-card p-lg text-center ultra-shadow">
          <Icon name="analytics" color="text-secondary text-[3rem] mb-4" />
          <h4 class="font-h3 mb-2">Suivi Performant</h4>
          <p class="text-on-surface-variant">Des graphiques dynamiques pour analyser les notes, l'assiduité et les performances par classe.</p>
        </div>
        <div class="glass-card p-lg text-center ultra-shadow">
          <Icon name="chat_bubble" color="text-tertiary text-[3rem] mb-4" />
          <h4 class="font-h3 mb-2">Lien Parents-École</h4>
          <p class="text-on-surface-variant">Gardez un contact permanent avec les parents grâce à nos outils de communication intégrés.</p>
        </div>
      </div>
    </section>

    <section class="px-4 md:px-margin-desktop py-xl">
      <h3 class="font-h2 text-center mb-xl text-2xl md:text-3xl">Comment ça fonctionne ?</h3>
      <div class="space-y-md max-w-4xl mx-auto">
        <div class="flex flex-col sm:flex-row items-center text-center sm:text-left gap-4 sm:gap-6 glass-card p-md">
          <div class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-h3 shrink-0">01</div>
          <div>
            <h4 class="font-label-lg mb-1">Initialisation</h4>
            <p class="text-on-surface-variant text-sm sm:text-base">Enregistrez vos classes et vos membres (Enfants, Moniteurs, Modérateurs) dans le système.</p>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row items-center text-center sm:text-left gap-4 sm:gap-6 glass-card p-md">
          <div class="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-h3 shrink-0">02</div>
          <div>
            <h4 class="font-label-lg mb-1">Planification</h4>
            <p class="text-on-surface-variant text-sm sm:text-base">Créez vos séances hebdomadaires et programmez les évaluations pour chaque niveau.</p>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row items-center text-center sm:text-left gap-4 sm:gap-6 glass-card p-md">
          <div class="w-16 h-16 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary font-h3 shrink-0">03</div>
          <div>
            <h4 class="font-label-lg mb-1">Analyse & Reporting</h4>
            <p class="text-on-surface-variant text-sm sm:text-base">Visualisez les progrès et génerez les rapports de fin d'année en un clic.</p>
          </div>
        </div>
      </div>
    </section>

    <footer class="px-4 md:px-margin-desktop py-lg border-t border-outline-variant text-center text-on-surface-variant">
      <p class="text-sm">&copy; 2026 EDCE Platform - Gestion scolaire optimisée.</p>
    </footer>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
const navigateTo = (to: string) => router.push(to)
</script>