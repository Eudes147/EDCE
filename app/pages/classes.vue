<template>
<!-- Class Selector Dropdown Section -->
<section class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
<div>
<h2 class="font-h1 text-h1 text-on-surface">Gestion des Classes</h2>
<p class="font-body text-body text-on-surface-variant">Consultez les statistiques et la liste des élèves pour chaque niveau.</p>
</div>
<div class="relative w-full md:w-64">
<select v-model="classe" class="w-full pl-4 pr-10 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-xl appearance-none focus:ring-2 focus:ring-primary focus:border-transparent outline-none font-body text-on-surface ultra-minimal-shadow cursor-pointer" style="transform: translateY(0px); transition: transform 0.2s ease-out;">
<option v-for="child_classe in child_classes" :value="child_classe">{{child_classe}}</option>
</select>
</div>
</section>
<!-- Stat Cards Grid -->
<section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
<!-- Garçons -->
<div class="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant ultra-minimal-shadow group hover:border-primary transition-colors">
<div class="flex justify-between items-start mb-4">
<div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
<Icon name="boy" />
</div>
<span class="text-caption font-caption text-on-surface-variant">+2 cette semaine</span>
</div>
<p class="font-h2 text-h2 text-on-surface">12</p>
<p class="font-caption text-caption text-on-surface-variant uppercase tracking-wider">Garçons</p>
</div>
<!-- Filles -->
<div class="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant ultra-minimal-shadow group hover:border-primary transition-colors" style="transform: translateY(0px); transition: transform 0.2s ease-out;">
<div class="flex justify-between items-start mb-4">
<div class="w-10 h-10 rounded-lg bg-tertiary/10 flex items-center justify-center text-tertiary">
<Icon name="girl" />

</div>
<span class="text-caption font-caption text-on-surface-variant">Stable</span>
</div>
<p class="font-h2 text-h2 text-on-surface">18</p>
<p class="font-caption text-caption text-on-surface-variant uppercase tracking-wider">Filles</p>
</div>
<!-- Examen -->
<div class="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant ultra-minimal-shadow group hover:border-primary transition-colors" style="transform: translateY(0px); transition: transform 0.2s ease-out;">
<div class="flex justify-between items-start mb-4">
<div class="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
<Icon name="assignment_turned_in" />
</div>
<span class="text-caption font-caption text-secondary font-bold">Session 2024</span>
</div>
<p class="font-h2 text-h2 text-on-surface">5</p>
<p class="font-caption text-caption text-on-surface-variant uppercase tracking-wider">Examen</p>
</div>
<!-- Défaillants -->
<div class="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant ultra-minimal-shadow group hover:border-error transition-colors" style="transform: translateY(0px); transition: transform 0.2s ease-out;">
<div class="flex justify-between items-start mb-4">
<div class="w-10 h-10 rounded-lg bg-error/10 flex items-center justify-center text-error">
<Icon name="warning" />
</div>
<span class="text-caption font-caption text-error font-bold">Action requise</span>
</div>
<p class="font-h2 text-h2 text-on-surface">2</p>
<p class="font-caption text-caption text-on-surface-variant uppercase tracking-wider">Défaillants</p>
</div>
</section>
<!-- Bento Grid Main Content -->
<section class="grid grid-cols-12 gap-6">
<!-- Section 1: Gender Breakdown Breakdown (Asymmetric) -->
<div class="col-span-12 lg:col-span-4 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant ultra-minimal-shadow" style="transform: translateY(0px); transition: transform 0.2s ease-out;">
<h3 class="font-h3 text-h3 text-on-surface mb-6 flex items-center gap-2">
<Icon color="text-primary" name="pie_chart" />
  Répartition par Sexe
</h3>
<div class="relative flex items-center justify-center py-8">
<!-- Circular Visual Mockup -->
<svg class="w-48 h-48 transform -rotate-90" viewBox="0 0 36 36">
<path class="text-tertiary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-dasharray="60, 100" stroke-width="4"></path>
<path class="text-primary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-dasharray="40, 100" stroke-dashoffset="-60" stroke-width="4"></path>
</svg>
<div class="absolute inset-0 flex flex-col items-center justify-center">
<span class="font-h2 text-h2 text-on-surface">30</span>
<span class="font-caption text-caption text-on-surface-variant">Total</span>
</div>
</div>
<div class="mt-6 space-y-3">
<div class="flex items-center justify-between p-3 rounded-lg bg-surface-container">
<div class="flex items-center gap-2">
<span class="w-3 h-3 rounded-full bg-primary"></span>
<span class="font-body text-body">Garçons (40%)</span>
</div>
<span class="font-bold text-on-surface">12</span>
</div>
<div class="flex items-center justify-between p-3 rounded-lg bg-surface-container">
<div class="flex items-center gap-2">
<span class="w-3 h-3 rounded-full bg-tertiary"></span>
<span class="font-body text-body">Filles (60%)</span>
</div>
<span class="font-bold text-on-surface">18</span>
</div>
</div>
</div>
<!-- Section 2: Table of Enfants en Classe d'Examen -->
<div class="col-span-12 lg:col-span-8 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant ultra-minimal-shadow overflow-hidden flex flex-col" style="transform: translateY(0px); transition: transform 0.2s ease-out;">
<div class="flex justify-between items-center mb-6">
<h3 class="font-h3 text-h3 text-on-surface flex items-center gap-2">
<Icon color="text-primary" name="school" />
                        Enfants en Classe d'Examen
                    </h3>
<button class="text-primary font-caption text-caption hover:underline">Voir tout</button>
</div>
<div class="flex-grow overflow-x-auto">
<table class="w-full text-left border-collapse">
<thead>
<tr class="border-b border-outline-variant">
<th class="pb-4 font-caption text-caption text-on-surface-variant uppercase tracking-wider">Nom de l'enfant</th>
<th class="pb-4 font-caption text-caption text-on-surface-variant uppercase tracking-wider">Âge</th>
<th class="pb-4 font-caption text-caption text-on-surface-variant uppercase tracking-wider">Niveau Scolaire</th>
<th class="pb-4 font-caption text-caption text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
</tr>
</thead>
<tbody class="divide-y divide-outline-variant/30">
<tr class="hover:bg-surface-container-low transition-colors group">
<td class="py-4 flex items-center gap-3">
<div class="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center font-bold text-primary text-small">KA</div>
<span class="font-body text-on-surface font-medium">Kouassi Armand</span>
</td>
<td class="py-4 font-body text-on-surface-variant">11 ans</td>
<td class="py-4">
<span class="px-2 py-1 rounded bg-secondary-fixed text-on-secondary-fixed text-caption font-bold">CM2</span>
</td>
<td class="py-4 text-right">
<button class="text-outline hover:text-primary transition-colors"><Icon name="more_vert" /></button>
</td>
</tr>
<tr class="hover:bg-surface-container-low transition-colors group">
<td class="py-4 flex items-center gap-3">
<div class="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center font-bold text-primary text-small">NM</div>
<span class="font-body text-on-surface font-medium">N'Guessan Marie</span>
</td>
<td class="py-4 font-body text-on-surface-variant">10 ans</td>
<td class="py-4">
<span class="px-2 py-1 rounded bg-secondary-fixed text-on-secondary-fixed text-caption font-bold">CM2</span>
</td>
<td class="py-4 text-right">
<button class="text-outline hover:text-primary transition-colors" data-icon="more_vert"> <Icon name="more_vert" /></button>
</td>
</tr>
<tr class="hover:bg-surface-container-low transition-colors group">
<td class="py-4 flex items-center gap-3">
<div class="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center font-bold text-primary text-small">BT</div>
<span class="font-body text-on-surface font-medium">Bakayoko Tidiane</span>
</td>
<td class="py-4 font-body text-on-surface-variant">12 ans</td>
<td class="py-4">
<span class="px-2 py-1 rounded bg-secondary-fixed text-on-secondary-fixed text-caption font-bold">CM2</span>
</td>
<td class="py-4 text-right">
<button class="text-outline hover:text-primary transition-colors"><Icon name="more_vert" /></button>
</td>
</tr>
<tr class="hover:bg-surface-container-low transition-colors group">
<td class="py-4 flex items-center gap-3">
<div class="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center font-bold text-primary text-small">SY</div>
<span class="font-body text-on-surface font-medium">Soro Yasmine</span>
</td>
<td class="py-4 font-body text-on-surface-variant">11 ans</td>
<td class="py-4">
<span class="px-2 py-1 rounded bg-secondary-fixed text-on-secondary-fixed text-caption font-bold">CM2</span>
</td>
<td class="py-4 text-right">
<button class="text-outline hover:text-primary transition-colors"><Icon name="more_vert" /></button>
</td>
</tr>
<tr class="hover:bg-surface-container-low transition-colors group">
<td class="py-4 flex items-center gap-3">
<div class="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center font-bold text-primary text-small">DE</div>
<span class="font-body text-on-surface font-medium">Diallo Emmanuel</span>
</td>
<td class="py-4 font-body text-on-surface-variant">11 ans</td>
<td class="py-4">
<span class="px-2 py-1 rounded bg-secondary-fixed text-on-secondary-fixed text-caption font-bold">CM2</span>
</td>
<td class="py-4 text-right">
<button class="text-outline hover:text-primary transition-colors"><Icon name="more_vert" /></button>
</td>
</tr>
</tbody>
</table>
</div>
</div>
</section>
<!-- Section 3: Summary of Participants Activities -->
<section class="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
<!-- Génie Biblique -->
<div class="bg-primary/5 p-6 rounded-xl border border-primary/20 flex items-center gap-6 relative overflow-hidden group">
<div class="absolute right-[-20px] top-[-20px] opacity-10 group-hover:scale-110 transition-transform">
<Icon color="text-[120px]" name="auto_stories" />
</div>
<div class="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
<Icon color="text-[120px]" name="auto_stories" />
</div>
<div>
<h4 class="font-h3 text-h3 text-primary mb-1">Participants Génie Biblique</h4>
<p class="font-body text-body text-on-surface-variant"><span class="font-bold text-primary">15 enfants</span> inscrits pour la compétition inter-classes.</p>
<div class="mt-3 flex -space-x-2">
<img alt="Avatar" class="w-8 h-8 rounded-full border-2 border-surface-bright" data-alt="A detailed portrait of a smiling young student in a modern educational setting. Soft lighting, high-end commercial aesthetic, blue and white color palette." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDQyjf_AB_bUt94rwGrXGawrsKeRpOGavs810Lf7eFxRUnhSXh_BGu7iVOi44due8cE1HNz4oKDffuOx2Iu4aiy9yXCYvXf7s2Dyhk5HoutO9IPy2TOT7nSvklF7kLa6MooR6JEzrEQ1vDQoIsNpIBy_QZmVHcu1M-KAjgYGEXKKFXLzGBsSmFoZrB0S3se9WTRQgbzu1cnzOWJLsfoBPkC49xGc9QsEwFwkpXr6ieOjZ8RLcp3JYhRdW6xw7XUvK9bGydvKOQ3Hs">
<img alt="Avatar" class="w-8 h-8 rounded-full border-2 border-surface-bright" data-alt="Portrait of a young girl with a focused expression, representing excellence in learning. Minimalist composition, clean background, warm and inviting atmosphere." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDq7BMuxnvw8l8pg3Q3pw49lNgWn0HYJ5JSq-BvVgB48p0NNp4ciiw_WzTP5FcI48e2tyE-nHXdq0VXFnQJSoDGE8A2wYBAHyYptkDfK1JVNlARbDGWzG0DK9tY6wTUS2asDq08aZpGg8euMLajrv8OK3n5oH02kLzZcqChjGaTgYbj1qyW8WxeoTBG562sUjGXKauHo6ty0Dwl55EmkSqE9TIMu13PlaiJzgH7NRY6wY63HCxNWBNxJbmAUIHwdHP4OFCP6GUrgZU">
<img alt="Avatar" class="w-8 h-8 rounded-full border-2 border-surface-bright" data-alt="Close-up of a child student looking bright and curious. Soft sunlight, serene and professional environment, integrated into the UI color scheme." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrj9BxOA_uSMAP3gkuaCpwVeU8ljy2PwdI3Ho6bcQgyyZ-tgKH9TzB7G5CSBPgbT2RSlp0ple0wTxfQTfbrL_eyM21xB6_ByKgqP9d1Pc2ky12hZDbvKD2KKGSj6bjoXSL-sAXj5AD81RhYTszszsDl-otzSt-Lt98K7m6khV9wAn8Ha2Wh_kQrCJg0ZvpVqdOOF77I_6NaXMgB3qXZFs9wzCzwg4VkDNJotjmGRgZLhdISPxK7_jcnM1KzufwfEwMhZyKdAEu_aQ">
<div class="w-8 h-8 rounded-full border-2 border-surface-bright bg-surface-container flex items-center justify-center text-caption font-bold text-on-surface-variant">+12</div>
</div>
</div>
</div>
<!-- Fête de Noël -->
<div class="bg-tertiary/5 p-6 rounded-xl border border-tertiary/20 flex items-center gap-6 relative overflow-hidden group">
<div class="absolute right-[-20px] top-[-20px] opacity-10 group-hover:scale-110 transition-transform">
<Icon color="text-[120px]" name="celebration" />
</div>
<div class="w-16 h-16 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center shadow-lg shadow-tertiary/20 shrink-0">
<Icon color="text-[32px]" name="auto_stories" />
</div>
<div>
<h4 class="font-h3 text-h3 text-tertiary mb-1">Participants Fête de Noël</h4>
<p class="font-body text-body text-on-surface-variant"><span class="font-bold text-tertiary">22 enfants</span> confirmés pour la chorale et les saynètes.</p>
<div class="mt-3 flex -space-x-2">
<div class="w-8 h-8 rounded-full border-2 border-surface-bright bg-surface-container flex items-center justify-center text-caption font-bold text-on-surface-variant">22</div>
<span class="ml-10 text-caption font-caption text-on-surface-variant self-center italic">Liste en cours de finalisation...</span>
</div>
</div>
</div>
</section>
</template>

<script setup>
  definePageMeta({
    layout: 'dashboard'
  })
  import {ref} from 'vue'

  import { classes } from '~/stores/child'

  const classe=ref('JuniorA')
  const child_classes= ref(classes)

</script>