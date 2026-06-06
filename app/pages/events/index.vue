<template>
  <section class="p-8 max-w-7xl w-full mx-auto">
<!-- Header Section -->
<div class="flex justify-between items-end mb-8">
<div>
<h2 class="font-h1 text-h1 text-on-background mb-1">Gestion des Événements</h2>
<p class="font-body text-body text-on-surface-variant">Planifiez et gérez les activités annuelles de l'école du dimanche.</p>
</div>
<button class="bg-primary text-on-primary px-6 py-2.5 rounded-lg flex items-center gap-2 font-body font-medium hover-lift transition-all">
<Icon name="add" color="text-[20px]" />
                    + Créer événement
                </button>
</div>
<!-- Stats Overview Cards (Bento Style Lite) -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
<div class="bg-surface-container-low p-6 rounded-xl soft-shadow flex flex-col gap-3">
<div class="flex items-center justify-between">
<Icon color="text-primary bg-primary-fixed p-2 rounded-lg " name="celebration" />
<span class="text-caption font-caption text-secondary">+2 cette année</span>
</div>
<div>
<p class="text-on-surface-variant font-small">Événements Total</p>
<h3 class="text-h2 font-h2 text-on-surface">12</h3>
</div>
</div>
<div class="bg-surface-container-low p-6 rounded-xl soft-shadow flex flex-col gap-3">
<div class="flex items-center justify-between">
<Icon color="text-secondary bg-secondary-fixed p-2 rounded-lg" name="pending_actions" />
<span class="text-caption font-caption text-secondary">3 à venir</span>
</div>
<div>
<p class="text-on-surface-variant font-small">Statut Actif</p>
<h3 class="text-h2 font-h2 text-on-surface">Planifié</h3>
</div>
</div>
<div class="bg-surface-container-low p-6 rounded-xl soft-shadow flex flex-col gap-3 overflow-hidden relative group">
<div class="absolute inset-0 opacity-10 transition-opacity group-hover:opacity-20">
<img class="object-cover w-full h-full" data-alt="A detailed closeup of a vibrant, warm Christmas tree decoration with golden fairy lights and deep red ornaments. The atmosphere is festive and intimate, with a soft bokeh background that evokes a cozy, celebratory holiday mood. The lighting is low-key and warm, perfectly capturing the spirit of a community Christmas tree event." src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7yd426ljy_ZWjbAIwG_d8ZxUDC2iCA8l5nBxEyzwp8YllmF-n8lEdw1LWgUNGH9pq-t6PBAKclyJWIDa53nUvXQYpp5vqSB_FHr8rZgS-yE45quDZsL7j170RColeMZnV0NYueqmi4sj5dQvpQVDSb9ZhZVHKjye13bOoi7XG8a7oOzoi3TMsp0bTRoxSC1i3kb_cns7ZxjeQI25Kv-5ja2yGyOi2OImJyyYB2yk1UIThQaRd7VxlcpXXJUFHFgiyhF4uA0AY6XA">
</div>
<div class="relative z-10">
<div class="flex items-center justify-between mb-3">
<Icon color="text-tertiary bg-tertiary-fixed p-2 rounded-lg" name="stars" />
</div>
<p class="text-on-surface-variant font-small">Prochain Grand Événement</p>
<h3 class="text-h3 font-h3 text-on-surface">Arbre de Noël</h3>
</div>
</div>
</div>
<!-- Events Table Card -->
<div class="bg-surface-container-lowest rounded-xl soft-shadow overflow-hidden">
<div class="px-6 py-4 border-b border-outline-variant/30 flex justify-between items-center bg-surface-bright">
<h3 class="font-h3 text-h3">Calendrier Annuel</h3>
<div class="flex gap-2">
<button class="px-3 py-1.5 text-small font-small border border-outline-variant rounded-lg flex items-center gap-1 hover:bg-surface-container-low transition-colors">
<Icon color="text-[16px]" name="filter_list" />
                            Filtrer
                        </button>
<button class="px-3 py-1.5 text-small font-small border border-outline-variant rounded-lg flex items-center gap-1 hover:bg-surface-container-low transition-colors">
<Icon color="text-[16px]" name="download" />
pan>
                            Exporter
                        </button>
</div>
</div>
<div class="overflow-x-auto">
<table class="w-full text-left border-collapse">
<thead>
<tr class="bg-surface-container-low/50">
<th class="px-6 py-4 font-caption text-caption text-outline uppercase tracking-wider">Type d'Événement</th>
<th class="px-6 py-4 font-caption text-caption text-outline uppercase tracking-wider text-center">Année</th>
<th class="px-6 py-4 font-caption text-caption text-outline uppercase tracking-wider">Statut</th>
<th class="px-6 py-4 font-caption text-caption text-outline uppercase tracking-wider">Date Prévue</th>
<th class="px-6 py-4 font-caption text-caption text-outline uppercase tracking-wider text-right">Actions</th>
</tr>
</thead>
<tbody class="divide-y divide-outline-variant/20">
<!-- Event Row 1 -->
<tr class="hover:bg-surface-container-low transition-colors group">
<td class="px-6 py-4">
<div class="flex items-center gap-3">
<div class="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary">
<Icon name="festival" />

</div>
<div>
<p class="font-body text-body font-medium">Arbre de Noël</p>
<p class="font-small text-small text-on-surface-variant">Fête de fin d'année</p>
</div>
</div>
</td>
<td class="px-6 py-4 text-center font-body text-body">2024</td>
<td class="px-6 py-4">
<span class="px-2.5 py-1 rounded-full bg-secondary-container/20 text-on-secondary-container text-caption font-medium border border-secondary-container/30">Planifié</span>
</td>
<td class="px-6 py-4 font-body text-body">22 Décembre 2024</td>
<td class="px-6 py-4">
<div class="flex items-center justify-end gap-2">
<button class="bg-primary/5 text-primary px-3 py-1.5 rounded-lg text-small font-medium hover:bg-primary/10 transition-colors flex items-center gap-1">
<Icon name="settings_suggest" color="text-[18px]" />
                                            Manage Activities
                                        </button>
<button class="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors">
<Icon name="visibilty" color="text-[20px]" />
</button>
<button class="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors">
<Icon name="edit" color="text-[20px]" />
</button>
<button class="p-2 text-error/80 hover:text-error hover:bg-error-container/20 rounded-lg transition-colors">
<Icon name="delete" color="text-[20px]" />
</button>
</div>
</td>
</tr>
<!-- Event Row 2 -->
<tr class="hover:bg-surface-container-low transition-colors group">
<td class="px-6 py-4">
<div class="flex items-center gap-3">
<div class="w-10 h-10 rounded-lg bg-tertiary-container/10 flex items-center justify-center text-tertiary">
<<Icon name="theater_comedy" />

</div>
<div>
<p class="font-body text-body font-medium">Soirée Récréative</p>
<p class="font-small text-small text-on-surface-variant">Spectacle &amp; Talent Show</p>
</div>
</div>
</td>
<td class="px-6 py-4 text-center font-body text-body">2024</td>
<td class="px-6 py-4">
<span class="px-2.5 py-1 rounded-full bg-surface-container-highest text-on-surface-variant text-caption font-medium border border-outline-variant/30">Brouillon</span>
</td>
<td class="px-6 py-4 font-body text-body">15 Août 2024</td>
<td class="px-6 py-4">
<div class="flex items-center justify-end gap-2">
<button class="bg-primary/5 text-primary px-3 py-1.5 rounded-lg text-small font-medium hover:bg-primary/10 transition-colors flex items-center gap-1">
<Icon name="settings_suggest" color="text-[18px]" />
                                            Manage Activities
                                        </button>
<button class="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors">
<Icon name="visibilty" color="text-[20px]" />
</button>
<button class="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors">
<Icon name="edit" color="text-[20px]" />
</button>
<button class="p-2 text-error/80 hover:text-error hover:bg-error-container/20 rounded-lg transition-colors">
<Icon name="delete" color="text-[20px]" />
</button>
</div>
</td>
</tr>
<!-- Event Row 3 -->
<tr class="hover:bg-surface-container-low transition-colors group">
<td class="px-6 py-4">
<div class="flex items-center gap-3">
<div class="w-10 h-10 rounded-lg bg-secondary-container/10 flex items-center justify-center text-secondary">
<Icon name="quiz"  />

</div>
<div>
<p class="font-body text-body font-medium">Génie Biblique</p>
<p class="font-small text-small text-on-surface-variant">Compétition de connaissances</p>
</div>
</div>
</td>
<td class="px-6 py-4 text-center font-body text-body">2024</td>
<td class="px-6 py-4">
<span class="px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-caption font-medium border border-green-200">Terminé</span>
</td>
<td class="px-6 py-4 font-body text-body">10 Mai 2024</td>
<td class="px-6 py-4">
<div class="flex items-center justify-end gap-2">
<button class="bg-primary/5 text-primary px-3 py-1.5 rounded-lg text-small font-medium hover:bg-primary/10 transition-colors flex items-center gap-1">
<Icon name="settings_suggest" color="text-[18px]" />

                                            Manage Activities
                                        </button>
<button class="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors">
<Icon name="visibilty" color="text-[20px]" />

</button>
<button class="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors">
<Icon name="edit" color="text-[20px]" />

</button>
<button class="p-2 text-error/80 hover:text-error hover:bg-error-container/20 rounded-lg transition-colors">
<Icon name="delete" color="text-[20px]" />

</button>
</div>
</td>
</tr>
</tbody>
</table>
</div>
<div class="px-6 py-4 border-t border-outline-variant/30 flex items-center justify-between bg-surface-bright">
<p class="font-small text-small text-on-surface-variant">Affichage de 1-3 sur 12 événements</p>
<div class="flex gap-1">
<button class="p-2 rounded-lg hover:bg-surface-container transition-colors disabled:opacity-30">
<Icon name="chevron_left" />

</button>
<button class="w-8 h-8 rounded-lg bg-primary text-on-primary font-small flex items-center justify-center">1</button>
<button class="w-8 h-8 rounded-lg hover:bg-surface-container font-small flex items-center justify-center transition-colors">2</button>
<button class="w-8 h-8 rounded-lg hover:bg-surface-container font-small flex items-center justify-center transition-colors">3</button>
<button class="p-2 rounded-lg hover:bg-surface-container transition-colors">
<Icon name="chevron_right" />

</button>
</div>
</div>
</div>
<!-- Activity Management Teaser / Empty State logic potential -->
<div class="mt-10 p-8 rounded-2xl bg-gradient-to-br from-primary-container to-primary text-on-primary-container flex flex-col md:flex-row items-center justify-between gap-6 soft-shadow relative overflow-hidden group">
<div class="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
<div class="relative z-10 flex flex-col gap-2">
<h4 class="font-h2 text-h2 text-white">Centralisez vos activités</h4>
<p class="font-body text-body text-on-primary-container/90 max-w-lg">Attribuez des tâches, gérez le budget et suivez la progression en temps réel pour chaque événement annuel depuis un seul tableau de bord.</p>
</div>
<div class="relative z-10">
<button class="bg-white text-primary px-8 py-3 rounded-xl font-body font-semibold shadow-lg hover:bg-primary-fixed transition-all flex items-center gap-2">
<Icon name="auto_awesome" />

                        Lancer l'assistant
                    </button>
</div>
</div>
</section>
<footer class="mt-auto p-6 text-center">
<p class="font-caption text-caption text-outline-variant">© 2024 EDCE v2 Management System • Sunday School Administration Interface</p>
</footer>
<div class="fixed bottom-8 right-8 z-50">
<button class="w-14 h-14 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all">
<Icon color="text-[32px]" name="event_available" />
</button>
</div>
</template>
<script setup>
definePageMeta({
  layout: 'dashboard',
})
</script>