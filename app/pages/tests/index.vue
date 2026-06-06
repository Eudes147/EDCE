<template>
<header class="flex justify-between items-center w-full px-margin-desktop py-sm h-16 bg-background border-b border-outline-variant sticky top-0 z-20">
<div class="flex items-center gap-4">
<h2 class="font-h3 text-h3 text-on-surface">Gestion des Tests</h2>
</div>
<div class="flex items-center gap-sm">
<div class="relative group">
<div class="absolute left-3 top-1/2 -translate-y-1/2">
<Icon color="text-outline" name="search" />
</div>
<input v-model="searchTest" class="pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 w-64 transition-all" placeholder="Rechercher un test..." type="text">
</div>
<button class="p-2 rounded-full hover:bg-surface-container transition-colors relative">
<Icon color="text-on-surface-variant" name="notifications" />
<span class="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
</button>
<div class="w-8 h-8 rounded-full overflow-hidden border border-outline-variant"></div>
</div>
</header>

<div class="p-margin-desktop space-y-lg">
<div class="flex flex-col md:flex-row md:items-center justify-between gap-md">
<div class="flex flex-wrap gap-sm">
<select v-model="classeSelected" class="px-4 py-2 bg-white border border-outline-variant rounded-lg text-body-sm font-label-md focus:ring-primary focus:border-primary">
<option value="all">Toutes les classes</option>
<option v-for="child_classe in child_classes" :key="child_classe" :value="child_classe">{{ child_classe }}</option>
</select>
<select v-model="monthSelected" class="px-4 py-2 bg-white border border-outline-variant rounded-lg text-body-sm font-label-md focus:ring-primary focus:border-primary">
<option value="all">Tous les Mois</option>
<option v-for="(month,index) in months" :key="index" :value="month">{{ month.charAt(0).toUpperCase()+month.slice(1) }}</option>
</select>
</div>
<button class="flex items-center gap-2 px-6 py-2.5 bg-primary-container text-white rounded-lg hover:shadow-lg transition-all active:scale-95 font-label-md" @click="activeTestModal=true">
<Icon name="add" />
Ajouter test
</button>
</div>

<div class="grid grid-cols-1 md:grid-cols-4 gap-gutter">
<div class="bg-surface-container-lowest border border-outline-variant p-md rounded-xl hover:shadow-sm transition-shadow">
<div class="flex items-center justify-between mb-sm">
<span class="p-2 bg-primary/10 rounded-lg"><Icon color="text-primary" name="description" /></span>
<span class="text-label-sm text-outline">+12% ce mois</span>
</div>
<p class="text-label-sm text-on-surface-variant">Total des Tests</p>
<h3 class="text-h3 font-h3 text-on-surface">124</h3>
</div>
<div class="bg-surface-container-lowest border border-outline-variant p-md rounded-xl hover:shadow-sm transition-shadow">
<div class="flex items-center justify-between mb-sm">
<span class="p-2 bg-secondary-container/10 rounded-lg"><Icon color="text-secondary-container" name="pending" /></span>
</div>
<p class="text-label-sm text-on-surface-variant">En attente de correction</p>
<h3 class="text-h3 font-h3 text-on-surface">18</h3>
</div>
<div class="bg-surface-container-lowest border border-outline-variant p-md rounded-xl hover:shadow-sm transition-shadow">
<div class="flex items-center justify-between mb-sm">
<span class="p-2 bg-tertiary-container/10 rounded-lg"><Icon color="text-tertiary-container" name="history_edu" /></span>
</div>
<p class="text-label-sm text-on-surface-variant">Évaluations passées</p>
<h3 class="text-h3 font-h3 text-on-surface">856</h3>
</div>
<div class="bg-surface-container-lowest border border-outline-variant p-md rounded-xl hover:shadow-sm transition-shadow">
<div class="flex items-center justify-between mb-sm">
<span class="p-2 bg-primary-fixed-dim/10 rounded-lg"><Icon color="text-primary-fixed-dim" name="calendar_today" /></span>
</div>
<p class="text-label-sm text-on-surface-variant">Prévus cette semaine</p>
<h3 class="text-h3 font-h3 text-on-surface">4</h3>
</div>
</div>

<div class="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
<div class="overflow-x-auto">
<table class="w-full text-left border-collapse">
<thead>
<tr class="bg-surface-container-low text-on-surface-variant border-b border-outline-variant">
<th class="px-md py-4 font-label-md">Nom du Test</th>
<th class="px-md py-4 font-label-md">Classe</th>
<th class="px-md py-4 font-label-md">Créé par</th>
<th class="px-md py-4 font-label-md">Date</th>
<th class="px-md py-4 font-label-md text-right">Actions</th>
</tr>
</thead>
<tbody class="divide-y divide-outline-variant">
<tr class="hover:bg-surface-container-lowest transition-colors group">
<td class="px-md py-4">
<div class="flex items-center gap-3">
<div class="p-2 bg-primary/5 rounded border border-primary/10">
<Icon color="text-primary" name="picture_as_pdf" />
</div>
<div>
<span class="block font-label-md text-on-surface">Évaluation Genèse</span>
<span class="text-label-sm text-on-surface-variant px-2 py-0.5 bg-surface-container rounded-full">EVALUATION</span>
</div>
</div>
</td>
<td class="px-md py-4 text-body-sm text-on-surface-variant">Niveau 2, Niveau 3</td>
<td class="px-md py-4">
<div class="flex items-center gap-2">
<img alt="Avatar" class="w-6 h-6 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2vDpsn6QHNQDjXokY7rUpzzVtPkBT-mfWueAtmwACp0ug9D6rtFUM9lYZJU4XpeObMN0VHQ0pQqvsgvjk-dooS2PY_o-1UUQrRcVUN8a5ypAXtWtrKRn5TrW8iFczKw8pypBPi4BWqByCKMlclDLRHUqNIa1krR0Dl9JLY-ahoRun8CmZCQS_u7C5AzXUTqHWV-ZiSxf_9hstxbwfxEFNSzfQiJgwrg3x5VVAmQJtm6ptqA6yUMqY8QHxWmsgPiugtfIEhxd_7ZE">
<span class="text-body-sm font-label-md">Jean Dupont</span>
</div>
</td>
<td class="px-md py-4 text-body-sm text-on-surface-variant">12 Oct 2023</td>
<td class="px-md py-4 text-right">
<div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
<button class="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Voir"><Icon color="text-on-surface-variant" name="visibility" /></button>
<button class="p-2 text-on-surface-variant hover:text-secondary-container hover:bg-secondary-container/10 rounded-lg transition-colors" title="Éditer"><Icon color="text-on-surface-variant" name="edit" /></button>
<button class="p-2 text-on-surface-variant hover:text-primary-container hover:bg-primary-container/10 rounded-lg transition-colors" title="Télécharger"><Icon color="text-on-surface-variant" name="download" /></button>
<button class="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg transition-colors" title="Supprimer"><Icon color="text-on-surface-variant" name="delete" /></button>
</div>
</td>
</tr>
<tr class="hover:bg-surface-container-lowest transition-colors group">
<td class="px-md py-4">
<div class="flex items-center gap-3">
<div class="p-2 bg-secondary-container/5 rounded border border-secondary-container/10">
<Icon color="text-secondary-container" name="assignment" />
</div>
<div>
<span class="block font-label-md text-on-surface">Quiz Paraboles</span>
<span class="text-label-sm text-secondary-container px-2 py-0.5 bg-secondary-container/10 rounded-full">SUNDAY_SCHOOL</span>
</div>
</div>
</td>
<td class="px-md py-4 text-body-sm text-on-surface-variant">Niveau 1</td>
<td class="px-md py-4">
<div class="flex items-center gap-2">
<img alt="Avatar" class="w-6 h-6 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuADs5ETsKdmIGX9ezOPA74rmXumT6fpi-RITYi-NtwrPfkWOpJHcW9PwhyMmqt5cY_hDBJA0kuEm6EwkGcRJm4Vk-tA_MztsRBxxMm2J7GPyl-0mCm6-vG9XcsoiEkSaigYiJmZLSGB7auMSyL60QBG2-rzZ3tp8s3rlI_r1oaNKFbkCxhyVVEGrl4k43DjbEWWI647Q8qtp14z8K3OSVyHmsD-wF3VGG6lB0IspDWiUtF71DzKReyRd1rK1LlnlziMoq6KjJU4suc">
<span class="text-body-sm font-label-md">Marie Curie</span>
</div>
</td>
<td class="px-md py-4 text-body-sm text-on-surface-variant">05 Oct 2023</td>
<td class="px-md py-4 text-right">
<div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
<button class="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Voir"><Icon color="text-on-surface-variant" name="visibility" /></button>
<button class="p-2 text-on-surface-variant hover:text-secondary-container hover:bg-secondary-container/10 rounded-lg transition-colors" title="Éditer"><Icon color="text-on-surface-variant" name="edit" /></button>
<button class="p-2 text-on-surface-variant hover:text-primary-container hover:bg-primary-container/10 rounded-lg transition-colors" title="Télécharger"><Icon color="text-on-surface-variant" name="download" /></button>
<button class="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg transition-colors" title="Supprimer"><Icon color="text-on-surface-variant" name="delete" /></button>
</div>
</td>
</tr>
<tr class="hover:bg-surface-container-lowest transition-colors group">
<td class="px-md py-4">
<div class="flex items-center gap-3">
<div class="p-2 bg-primary/5 rounded border border-primary/10">
<Icon color="text-primary" name="picture_as_pdf" />
</div>
<div>
<span class="block font-label-md text-on-surface">Test Final Trimestre 1</span>
<span class="text-label-sm text-on-surface-variant px-2 py-0.5 bg-surface-container rounded-full">EVALUATION</span>
</div>
</div>
</td>
<td class="px-md py-4 text-body-sm text-on-surface-variant">Confirmands</td>
<td class="px-md py-4">
<div class="flex items-center gap-2">
<img alt="Avatar" class="w-6 h-6 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvQCduQIySBs5BEdq3gIGZ-pzkOS_-SscBt0OAGN94i5lgv_BOyo1MCRimmOyZpFMyc1o0cTLRvtSrXQelrdq_zHkTrjj6qNXGxwm4z0BS989bXxpiB0LHJbqgEJeFhYTxWxzGCZwOvb-C-rF2d-XMDgCNSH4zgaQDtcL8kGWoYn856zFSrUuLFICPVVlRCsi0Ot-VBsgs4aTOUfCbumJTqTp1qlv72qeC4Q5y1UrLA1r-kBWXseL8LYjPz5QXBVY7LYGfvbS73hE">
<span class="text-body-sm font-label-md">Marc Levie</span>
</div>
</td>
<td class="px-md py-4 text-body-sm text-on-surface-variant">28 Sep 2023</td>
<td class="px-md py-4 text-right">
<div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
<button class="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Voir"><Icon color="text-on-surface-variant" name="visibility" /></button>
<button class="p-2 text-on-surface-variant hover:text-secondary-container hover:bg-secondary-container/10 rounded-lg transition-colors" title="Éditer"><Icon color="text-on-surface-variant" name="edit" /></button>
<button class="p-2 text-on-surface-variant hover:text-primary-container hover:bg-primary-container/10 rounded-lg transition-colors" title="Télécharger"><Icon color="text-on-surface-variant" name="download" /></button>
<button class="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg transition-colors" title="Supprimer"><Icon color="text-on-surface-variant" name="delete" /></button>
</div>
</td>
</tr>
</tbody>
</table>
</div>

<div class="flex items-center justify-between px-md py-4 bg-surface-container-lowest border-t border-outline-variant">
<span class="text-body-sm text-on-surface-variant">Affichage 1-10 de 124 tests</span>
<div class="flex gap-xs">
<button class="p-2 border border-outline-variant rounded hover:bg-surface-container transition-colors"><Icon name="chevron_left" color="text-on-surface-variant" /></button>
<button class="px-3 py-1 bg-primary text-white rounded font-label-md">1</button>
<button class="px-3 py-1 hover:bg-surface-container rounded font-label-md transition-colors">2</button>
<button class="px-3 py-1 hover:bg-surface-container rounded font-label-md transition-colors">3</button>
<button class="p-2 border border-outline-variant rounded hover:bg-surface-container transition-colors"><Icon name="chevron_right" color="text-on-surface-variant" /></button>
</div>
</div>
</div>
</div>

<div :class="[activeTestModal ? '':'hidden','fixed inset-0 z-50 flex items-center justify-center p-margin-mobile']" id="createTestModal">
<div class="absolute inset-0 bg-[#3D3936] bg-opacity-20 backdrop-blur-sm" @click="activeTestModal=false"></div>
<div class="relative bg-white w-full max-w-lg rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-300">
<div class="px-md py-4 bg-surface-container-lowest border-b border-outline-variant flex items-center justify-between">
<h3 class="font-h3 text-h3 text-on-surface">Ajouter un nouveau test</h3>
<button class="p-2 hover:bg-surface-container rounded-full transition-colors" @click="activeTestModal=false">
<Icon name="close" color="text-on-surface" />
</button>
</div>

<div class="p-md space-y-md">
<div class="space-y-xs">
<label class="block font-label-md text-on-surface">Titre du Test</label>
<input v-model="titleTest" class="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="ex: Evaluation Mai 2025" type="text">
</div>

<div class="space-y-xs">
<label class="block font-label-md text-on-surface">Classe concernée</label>
<div class="flex flex-wrap gap-2 p-2 min-h-[44px] bg-surface-container-low border border-outline-variant rounded-lg cursor-pointer">
<select v-model="classe" class="flex-10 w-full bg-transparent border-none focus:ring-0 text-body-sm p-1">
<option v-for="child_classe in child_classes" :key="child_classe" :value="child_classe">{{ child_classe }}</option>
</select>
</div>
</div>

<div class="space-y-xs">
<label class="block font-label-md text-on-surface">Type de test</label>
<div class="grid grid-cols-3 gap-sm">
<label class="flex items-center gap-3 p-3 border border-outline-variant rounded-lg cursor-pointer hover:bg-surface-container-low transition-colors">
<input v-model="typeTest" class="w-4 h-4 text-primary focus:ring-primary" name="testType" type="radio" value="EVALUATION">
<span class="font-label-md">Évaluation</span>
</label>
<label class="flex items-center gap-3 p-3 border border-outline-variant rounded-lg cursor-pointer hover:bg-surface-container-low transition-colors">
<input v-model="typeTest" class="w-4 h-4 text-primary focus:ring-primary" name="testType" type="radio" value="SUNDAY_SCHOOL">
<span class="font-label-md">Sunday School</span>
</label>
<label class="flex items-center gap-3 p-3 border border-outline-variant rounded-lg cursor-pointer hover:bg-surface-container-low transition-colors">
<input v-model="typeTest" class="w-4 h-4 text-primary focus:ring-primary" name="testType" type="radio" value="CONCOURS">
<span class="font-label-md">Concours</span>
</label>
</div>
</div>

<div class="grid grid-cols-1 md:grid-cols-2 gap-md">
<div class="space-y-xs">
<label class="block font-label-md text-on-surface">Sujet du test (PDF)</label>
<div class="border-2 border-dashed border-outline-variant rounded-xl p-4 text-center hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group">
<Icon name="upload_file" color="text-outline" />
<p class="text-label-sm text-outline group-hover:text-primary-container">Glissez le fichier ou cliquez</p>
</div>
</div>
<div class="space-y-xs">
<label class="block font-label-md text-on-surface">Corrigé (PDF)</label>
<div class="border-2 border-dashed border-outline-variant rounded-xl p-4 text-center hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group">
<Icon name="fact_check" color="text-outline" />
<p class="text-label-sm text-outline group-hover:text-primary-container">Glissez le fichier ou cliquez</p>
</div>
</div>
</div>
</div>

<div class="px-md py-4 bg-surface-container-low border-t border-outline-variant flex justify-end gap-sm">
<button class="px-6 py-2.5 font-label-md text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors" @click="activeTestModal=false">Annuler</button>
<button class="px-6 py-2.5 font-label-md bg-primary text-white rounded-lg hover:shadow-lg transition-all active:scale-95">Créer le test</button>
</div>
</div>
</div>
</template>

<script setup lang="ts">
  definePageMeta({
  layout: 'dashboard',
})
import { computed, ref } from 'vue'
import { classes } from '~/stores/child'

const formatDate = (dateStr: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateStr).toLocaleDateString('fr-FR', options)
}

const months = ref([
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre'
])

const child_classes = ref(classes)
const classeSelected = ref('all')
const monthSelected = ref('all')
const activeTestModal = ref(false)
const titleTest = ref('')
const typeTest = ref('EVALUATION')
const classe = ref('JuniorA')
const searchTest = ref('')

const formTest = computed(() => ({
  nameTest: titleTest.value,
  classe: classe.value,
  typeTest: typeTest.value,
  testPDF: '',
  correctionPDF: ''
}))
</script>