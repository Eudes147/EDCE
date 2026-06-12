<template>
  <div class="min-h-screen bg-background text-on-surface font-body">
    <nav class="w-full border-b border-outline-variant bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div class="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        <h1 class="font-h2 text-primary font-bold text-2xl">EDCE</h1>
        <div class="flex items-center gap-3">
          <button @click="navigateTo('/register')" class="bg-transparent text-primary border border-primary px-4 py-2 sm:px-6 rounded-lg font-label-md hover:bg-primary/5 transition-all text-sm">
            Créer un compte
          </button>
          <button @click="navigateTo('/login')" class="bg-primary text-white px-4 py-2 sm:px-6 rounded-lg font-label-md hover:opacity-90 transition-all text-sm">
            Se Connecter
          </button>
        </div>
      </div>
    </nav>

    <header class="py-20 md:py-32 px-6 text-center max-w-5xl mx-auto">
      <h2 class="text-4xl md:text-6xl font-bold text-primary mb-6 leading-tight">
        Gérez votre école du dimanche avec <span class="text-secondary">excellence</span>
      </h2>
      <p class="text-on-surface-variant text-lg md:text-xl max-w-2xl mx-auto mb-10">
        La plateforme tout-en-un pour organiser les enseignements, suivre le parcours spirituel des enfants et simplifier la gestion quotidienne pour vos moniteurs.
      </p>
      <div class="flex flex-col sm:flex-row justify-center gap-4">
        <button class="bg-primary text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
          Commencer maintenant
        </button>
        <button class="bg-surface-container text-on-surface px-8 py-4 rounded-xl font-bold hover:bg-surface-container-high transition-colors">
          Voir les fonctionnalités
        </button>
      </div>
    </header>

    <section class="px-6 py-20 bg-surface-container-lowest">
      <div class="max-w-7xl mx-auto">
        <h3 class="text-3xl md:text-4xl font-bold text-center mb-16">Pourquoi nous choisir ?</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="glass-card p-8 text-center rounded-2xl bg-white border border-outline-variant/30 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <Icon name="groups" class="text-primary text-5xl md:text-6xl mb-6" />
            <h4 class="text-xl font-bold mb-3">Gestion Simplifiée</h4>
            <p class="text-on-surface-variant">Centralisez toutes les informations de vos enfants et moniteurs dans une interface intuitive.</p>
          </div>
          <div class="glass-card p-8 text-center rounded-2xl bg-white border border-outline-variant/30 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <Icon name="analytics" class="text-secondary text-5xl md:text-6xl mb-6" />
            <h4 class="text-xl font-bold mb-3">Suivi Performant</h4>
            <p class="text-on-surface-variant">Des graphiques dynamiques pour analyser les notes, l'assiduité et les performances par classe.</p>
          </div>
          <div class="glass-card p-8 text-center rounded-2xl bg-white border border-outline-variant/30 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <Icon name="chat_bubble" class="text-tertiary text-5xl md:text-6xl mb-6" />
            <h4 class="text-xl font-bold mb-3">Lien Parents-École</h4>
            <p class="text-on-surface-variant">Gardez un contact permanent avec les parents grâce à nos outils de communication intégrés.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="px-6 py-20 max-w-7xl mx-auto">
      <h3 class="text-3xl md:text-4xl font-bold text-center mb-16">Comment ça fonctionne ?</h3>
      <div class="space-y-6 max-w-4xl mx-auto">
        <div class="flex flex-col sm:flex-row items-center text-center sm:text-left gap-6 glass-card p-6 bg-white rounded-2xl border border-outline-variant/30 hover:border-primary/30 transition-colors">
          <div class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl shrink-0">01</div>
          <div>
            <h4 class="text-lg font-bold mb-1">Initialisation</h4>
            <p class="text-on-surface-variant">Enregistrez vos classes et vos membres (Enfants, Moniteurs, Modérateurs) dans le système.</p>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row items-center text-center sm:text-left gap-6 glass-card p-6 bg-white rounded-2xl border border-outline-variant/30 hover:border-secondary/30 transition-colors">
          <div class="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold text-2xl shrink-0">02</div>
          <div>
            <h4 class="text-lg font-bold mb-1">Planification</h4>
            <p class="text-on-surface-variant">Créez vos séances hebdomadaires et programmez les évaluations pour chaque niveau.</p>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row items-center text-center sm:text-left gap-6 glass-card p-6 bg-white rounded-2xl border border-outline-variant/30 hover:border-tertiary/30 transition-colors">
          <div class="w-16 h-16 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary font-bold text-2xl shrink-0">03</div>
          <div>
            <h4 class="text-lg font-bold mb-1">Analyse & Reporting</h4>
            <p class="text-on-surface-variant">Visualisez les progrès et générez les rapports de fin d'année en un clic.</p>
          </div>
        </div>
      </div>
    </section>

    <footer class="px-6 py-10 border-t border-outline-variant text-center text-on-surface-variant">
      <p class="text-sm">&copy; 2026 EDCE Platform - Gestion scolaire optimisée.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
const navigateTo = (to: string) => router.push(to)
</script>