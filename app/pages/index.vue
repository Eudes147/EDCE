<template>
  <div class="min-h-screen bg-background text-on-surface font-body">
    <nav class="flex justify-between items-center px-margin-desktop py-md border-b border-outline-variant bg-background sticky top-0 z-50">
      <h1 class="font-h2 text-primary font-bold">EDCE</h1>
      <button @click="navigateTo('/dashboard')" class="bg-primary text-white px-6 py-2 rounded-lg font-label-md hover:scale-95 transition-transform">
        Accéder au Dashboard
      </button>
    </nav>

    <header class="py-xl px-margin-desktop text-center">
      <h2 class="font-h1 text-[3rem] font-bold text-primary mb-4">Gérez votre école du dimanche avec <span class="text-secondary">excellence</span></h2>
      <p class="font-body-lg text-on-surface-variant max-w-2xl mx-auto mb-lg">
        La plateforme tout-en-un pour organiser les enseignements, suivre le parcours spirituel des enfants et simplifier la gestion quotidienne pour vos moniteurs.
      </p>
      <div class="flex justify-center gap-4">
        <button class="bg-primary text-white px-8 py-4 rounded-xl font-label-md ultra-shadow">Commencer maintenant</button>
        <button class="bg-surface-container text-on-surface px-8 py-4 rounded-xl font-label-md">Voir les fonctionnalités</button>
      </div>
    </header>

    <section class="px-margin-desktop py-xl bg-surface-container-lowest">
      <h3 class="font-h2 text-center mb-xl">Pourquoi nous choisir ?</h3>
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

    <section class="px-margin-desktop py-xl">
      <h3 class="font-h2 text-center mb-xl">Comment ça fonctionne ?</h3>
      <div class="space-y-md max-w-4xl mx-auto">
        <div class="flex items-center gap-6 glass-card p-md">
          <div class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-h3">01</div>
          <div>
            <h4 class="font-label-lg">Initialisation</h4>
            <p>Enregistrez vos classes et vos membres (Enfants, Moniteurs, Modérateurs) dans le système.</p>
          </div>
        </div>
        <div class="flex items-center gap-6 glass-card p-md">
          <div class="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-h3">02</div>
          <div>
            <h4 class="font-label-lg">Planification</h4>
            <p>Créez vos séances hebdomadaires et programmez les évaluations pour chaque niveau.</p>
          </div>
        </div>
        <div class="flex items-center gap-6 glass-card p-md">
          <div class="w-16 h-16 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary font-h3">03</div>
          <div>
            <h4 class="font-label-lg">Analyse & Reporting</h4>
            <p>Visualisez les progrès et générez les rapports de fin d'année en un clic.</p>
          </div>
        </div>
      </div>
    </section>

    <footer class="px-margin-desktop py-lg border-t border-outline-variant text-center text-on-surface-variant">
      <p>&copy; 2026 EDCE Platform - Gestion scolaire optimisée.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
const navigateTo = (to: string) => router.push(to)
</script>