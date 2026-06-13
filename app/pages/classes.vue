<template>
  <section class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4">
    <div>
      <h2 class="font-h1 text-h1 text-on-surface">Gestion des Classes</h2>
      <p class="font-body text-body text-on-surface-variant">Consultez les statistiques et la liste des élèves pour chaque niveau.</p>
    </div>
    <div class="relative w-full md:w-64">
      <select v-model="classe" class="w-full pl-4 pr-10 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-xl appearance-none focus:ring-2 focus:ring-primary focus:border-transparent outline-none font-body text-on-surface ultra-minimal-shadow cursor-pointer transition-all">
        <option v-for="child_classe in child_classes" :key="child_classe" :value="child_classe">{{ child_classe }}</option>
      </select>
    </div>
  </section>
  <div v-if="isLoading">
    <Loader name="des classes." />
  </div>
  <div v-else-if="childrenPerClass">
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        <div class="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant ultra-minimal-shadow group hover:border-primary transition-colors">
          <div class="flex justify-between items-start mb-4">
            <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon name="boy" color="text-primary" />
            </div>
            <span class="text-caption font-caption text-on-surface-variant">{{ ((cardInfosRate.boyStats || 0) * 100).toFixed(2).toString().padStart(2, '0') }}%</span>
          </div>
          <p class="font-h2 text-h2 text-on-surface">{{ cardInfos.boyStats.toString().padStart(2, '0') }}</p>
          <p class="font-caption text-caption text-on-surface-variant uppercase tracking-wider">Garçons</p>
        </div>

        <div class="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant ultra-minimal-shadow group hover:border-primary transition-colors">
          <div class="flex justify-between items-start mb-4">
            <div class="w-10 h-10 rounded-lg bg-tertiary/10 flex items-center justify-center">
              <Icon name="girl" color="text-tertiary" />
            </div>
            <span class="text-caption font-caption text-on-surface-variant">{{ ((cardInfosRate.girlStats || 0) * 100).toFixed(2).toString().padStart(2, '0') }}%</span>
          </div>
          <p class="font-h2 text-h2 text-on-surface">{{ cardInfos.girlStats.toString().padStart(2, '0') }}</p>
          <p class="font-caption text-caption text-on-surface-variant uppercase tracking-wider">Filles</p>
        </div>

        <div class="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant ultra-minimal-shadow group hover:border-primary transition-colors">
          <div class="flex justify-between items-start mb-4">
            <div class="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
              <Icon name="assignment_turned_in" color="text-secondary" />
            </div>
            <span class="text-caption font-caption text-secondary font-bold">Session {{ actualYear }}</span>
          </div>
          <p class="font-h2 text-h2 text-on-surface">{{ (cardInfos.examStats||0).toString().padStart(2,'0') }}</p>
          <p class="font-caption text-caption text-on-surface-variant uppercase tracking-wider">Examen (Toutes classes)</p>
        </div>
      </section>

      <section class="grid grid-cols-12 gap-6 p-4">
        <div class="col-span-12 lg:col-span-4 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant ultra-minimal-shadow">
          <h3 class="font-h3 text-h3 text-on-surface mb-6 flex items-center gap-2">
            <Icon name="pie_chart" color="text-primary" />
            Répartition par Sexe
          </h3>
          <div class="relative flex items-center justify-center py-8">
            <svg class="w-48 h-48 transform -rotate-90" viewBox="0 0 36 36">
              <path class="text-tertiary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" :stroke-dasharray="`${(cardInfosRate.girlStats * 100) || 0}, 100`" stroke-width="4"></path>
              <path class="text-primary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" :stroke-dasharray="`${(cardInfosRate.boyStats * 100) || 0}, 100`" :stroke-dashoffset="-((cardInfosRate.girlStats * 100) || 0)" stroke-width="4"></path>
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="font-h2 text-h2 text-on-surface">{{ (cardInfos.boyStats + cardInfos.girlStats).toString().padStart(2, '0') }}</span>
              <span class="font-caption text-caption text-on-surface-variant">Total Classe</span>
            </div>
          </div>
          <div class="mt-6 space-y-3">
            <div class="flex items-center justify-between p-3 rounded-lg bg-surface-container">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-primary"></span>
                <span class="font-body text-body">Garçons ({{ ((cardInfosRate.boyStats || 0) * 100).toFixed(2) }}%)</span>
              </div>
              <span class="font-bold text-on-surface">{{ cardInfos.boyStats.toString().padStart(2, '0') }}</span>
            </div>
            <div class="flex items-center justify-between p-3 rounded-lg bg-surface-container">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-tertiary"></span>
                <span class="font-body text-body">Filles ({{ ((cardInfosRate.girlStats || 0) * 100).toFixed(2) }}%)</span>
              </div>
              <span class="font-bold text-on-surface">{{ cardInfos.girlStats.toString().padStart(2, '0') }}</span>
            </div>
          </div>
        </div>

        <div class="col-span-12 lg:col-span-8 bg-surface-container-lowest p-2 md:p-6 rounded-xl border border-outline-variant ultra-minimal-shadow overflow-hidden flex flex-col">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-sm md:font-h3 md:text-h3 text-on-surface flex items-center gap-2">
              <Icon name="school" color="text-primary" />
              Enfants en Classe d'Examen
            </h3>
            <div class="relative md:w-32">
              <select v-model="examClasse" class="bg-surface-container-low border border-outline-variant/30 rounded-lg text-xs px-3 py-2 focus:ring-1 focus:ring-primary focus:outline-none cursor-pointer">
                <option v-for="examClass in examClasses" :key="examClass" :value="examClass">{{ examClass }}</option>
              </select>
            </div>
          </div>
          
          <!-- <thead class="bg-surface-container-low text-xs text-on-surface-variant font-medium">
            <tr>
              <th class="px-4 py-3">Nom</th>
              <th class="px-4 py-3">Classe</th>
              <th class="px-4 py-3">Âge</th>
              <th class="px-4 py-3">Téléphone Parent</th>
              <th class="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant/30 text-sm">
            <tr v-for="child in childrenFiltered.slice(0, 10)" :key="child?.id || 'none'" class="hover:bg-surface-container-lowest transition-colors group">
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                    {{ getFullName(child?.name).initials }}
                  </div>
                  <div class="truncate max-w-[180px]">
                    <p class="font-medium text-on-surface truncate">{{ getFullName(child?.name)?.name || '--' }}</p>
                    <p class="text-[10px] text-on-surface-variant">Mail non défini</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-xs text-on-surface-variant">{{ child?.classe }}</td>
              <td class="px-4 py-3 text-xs">{{ getAgeByBirthDate(child?.birth_date || new Date()) }} ans</td>
              <td class="px-4 py-3">
                <span class="px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-[10px] font-bold border border-green-200/50">{{ child?.telParent || 'Non défini' }}</span>
              </td>
              <td class="px-4 py-3 text-right">
                <div class="flex justify-end gap-1">
                  <button class="p-1.5 text-on-surface-variant hover:text-primary rounded-md"><Icon size="1.2rem" name="visibility" /></button>
                  <button class="p-1.5 text-on-surface-variant hover:text-primary rounded-md"><Icon size="1.2rem" name="edit" /></button>
                  <button class="p-1.5 text-error hover:text-error/80 rounded-md"><Icon size="1.2rem" name="delete" /></button>
                </div>
              </td>
            </tr>
          </tbody>
        </ -->
          <div class="flex-grow overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead class="bg-surface-container-low text-xs text-on-surface-variant font-medium">
                <tr class="border-b border-outline-variant">
                  <th class="px-4 py-3">Nom</th>
              <th class="px-4 py-3">Age</th>
              <th class="px-4 py-3">Classe</th>
              <th class="px-4 py-3 text-right">Niveau Scolaire</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-outline-variant/30 text-sm">
                <tr v-if="!examClassInfos[examClasse] || examClassInfos[examClasse]?.length === 0" class="hover:bg-surface-container-lowest transition-colors group">
                  <td colspan="3" class="text-center py-8 text-on-surface-variant text-body-sm">
                    Aucun enfant en classe d'examen en {{ examClasse }}
                  </td>
                </tr>
                <tr v-else v-for="examClassInfo in examClassInfos[examClasse]" :key="examClassInfo.id || examClassInfo.name" class="hover:bg-surface-container-low transition-colors group">
                  <td class="px-4 py-3 flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center font-bold text-primary text-small">
                      {{ getFullName(examClassInfo.name)?.initials || '?' }}
                    </div>
                    <span class="font-body text-on-surface font-medium">{{ examClassInfo.name }}</span>
                  </td>
                  <td class="px-4 py-3 text-xs text-on-surface-variant">
                    {{ getAgeByBirthDate(examClassInfo?.birth_date||new Date()) }} ans
                  </td>
                  <td class="py-3 px-4 text-xs text-on-surface-variant">
                    {{ examClassInfo?.classe}}
                  </td>
                  <td class="py-4">
                    <span class="px-2 py-1 rounded bg-secondary-fixed text-on-secondary-fixed text-caption font-bold">{{ examClasse }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section class="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 pb-8">
        <div @click="showArbre=true" class="bg-primary/5 p-3 md:p-6 rounded-md md:rounded-xl border border-primary/20 flex items-center gap-2 md:gap-6 relative overflow-hidden group hover:cursor-pointer">
          <div class="absolute right-[-20px] top-[-20px] opacity-10 group-hover:scale-110 transition-transform">
            <Icon name="auto_stories" color="text-[96px]" />
          </div>
          <div class=" w-8 h-8 md:w-16 md:h-16 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
            <Icon name="auto_stories" color="text-on-primary" />
          </div>
          <div>
            <h4 class="text-sm font-semibold md:font-h3 md:text-h3 text-primary mb-1">Participants Génie Biblique (Arbre de Noël)</h4>
            <p class="text-xs font-semibold md:font-body md:text-body text-on-surface-variant">
              <span class="text-xs font-semibold md:font-bold text-primary">{{ getChildrenCountByGenieBib("Arbre de noël").count }} enfant(s)</span> inscrit(s) pour la compétition de Génie Biblique en {{ classe }}.
            </p>
          </div>
        </div>

        <div @click="showSoiree=true" class="bg-tertiary/5 p-3 md:p-6 rounded-md md:rounded-xl border border-tertiary/20 flex items-center gap-3 md:gap-6 relative overflow-hidden group hover:cursor-pointer">
          <div class="absolute right-[-20px] top-[-20px] opacity-10 group-hover:scale-110 transition-transform">
            <Icon name="celebration" color="text-[96px]" />
          </div>
          <div class=" w-8 h-8 md:w-16 md:h-16 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center shadow-lg shadow-tertiary/20 shrink-0">
            <Icon name="celebration" color="text-on-tertiary" />
          </div>
          <div>
            <h4 class="text-sm font-semibold md:font-h3 md:text-h3 text-tertiary mb-1">Participants des Génie Biblique (Soirée des enfants)</h4>
            <p class="text-xs font-semibold md:font-body md:text-body text-on-surface-variant">
              <span class="text-xs font-semibold md:font-bold text-tertiary">{{ getChildrenCountByGenieBib("Soirée récréative des enfants").count }} enfant(s)</span> participant(s) au Génie cette année en {{ classe }}.
            </p>
          </div>
        </div>
      </section>
  </div>
  <Modal v-model="showArbre" :title="`Participant des Génie Biblique en Arbre de noël — ${classe}`" size="md">
      <div class="p-1 max-h-[50vh] overflow-y-auto space-y-2 custom-scrollbar">
        <p class="text-xs text-on-surface-variant mb-3">Liste des participants-{{ classe }}.</p>
        <div v-for="(row, idx) in getChildrenCountByGenieBib('Soirée récréative des enfants').liste" v-if="getChildrenCountByGenieBib('Soirée récréative des enfants').liste.length != 0" :key="row.id" class="flex items-center gap-3 bg-surface-container-low border border-outline-variant/40 p-2.5 rounded-xl text-sm">
          <span :class="['w-6 text-center font-bold', idx === 0 ? 'text-secondary text-base' : 'text-on-surface-variant']">{{ idx + 1 }}</span>
          <div class="flex-1 flex justify-between items-center">
            <span class="font-medium text-on-surface truncate max-w-[180px]">{{ row?.name }}</span>
          </div>
        </div>
        <div v-else class="text-primary text-center">
            <p>Information Indisponible.</p>
          </div>
      </div>
      <template #footer>
        <button class="px-4 py-2 bg-primary text-white rounded-lg text-sm" @click="showArbre = false">Fermer la fenêtre.</button>
      </template>
  </Modal>
  <Modal v-model="showSoiree" :title="`Participant des Génie Biblique en Soirée récréative — ${classe}`" size="md">
      <div class="p-1 max-h-[50vh] overflow-y-auto space-y-2 custom-scrollbar">
        <p class="text-xs text-on-surface-variant mb-3">Liste des participants-{{ classe }}.</p>
        <div v-for="(row, idx) in getChildrenCountByGenieBib('Soirée récréative des enfants').liste" v-if="getChildrenCountByGenieBib('Soirée récréative des enfants').liste.length != 0" :key="row.id" class="flex items-center gap-3 bg-surface-container-low border border-outline-variant/40 p-2.5 rounded-xl text-sm">
          <span :class="['w-6 text-center font-bold', idx === 0 ? 'text-secondary text-base' : 'text-on-surface-variant']">{{ idx + 1 }}</span>
          <div class="flex-1 flex justify-between items-center">
            <span class="font-medium text-on-surface truncate max-w-[180px]">{{ row?.name }}</span>
          </div>
        </div>
        <div v-else class="text-primary text-center">
            <p>Information Indisponible.</p>
          </div>
      </div>
      <template #footer>
        <button class="px-4 py-2 bg-primary text-white rounded-lg text-sm" @click="showSoiree = false">Fermer la fenêtre.</button>
      </template>
  </Modal>
</template>

<script setup lang="ts">
import { definePageMeta } from '#imports'
import { computed, ref, onMounted } from 'vue'
import type { EventType } from '~/types/activity'
import type { ClasseType } from '~/types/classe'

// Utils
import { getAgeByBirthDate } from '~/utils/getAgebyBirthDate'
import { getFullName } from '~/utils/getFullName'
import { classes } from '~/stores/child'

// Composables
import { useChildren } from '~/composables/useChild'
import { useParticipantEventActivity } from '~/composables/useParticipant'
import {useToast} from '~/composables/useToast'

// Modal
const showArbre=ref(false)
const showSoiree=ref(false)


const toast=useToast()
definePageMeta({
  layout: 'dashboard'
})

// Accès aux instances des composables
const {fetchAllChildren, examClasses, childrenExamClass, totalBoy, totalGirl,childrenPerClass, isLoading} = useChildren()
const { getChildrenByActivityTitle,fetchAllEventData } = useParticipantEventActivity()



// State Réactif
const classe = ref<ClasseType>('JuniorA')
const child_classes = ref<ClasseType[]>(classes)
const examClasse = ref(examClasses[0] || 'CM2')

const actualYear = computed(() => new Date().getFullYear().toString())

// Gestionnaires de filtres pour les compétitions
const getChildrenCountByGenieBib = computed(() => {
  return (eventType: EventType) => {
    const activityData = getChildrenByActivityTitle(actualYear.value, eventType)
    const liste = activityData["Génie Biblique"]?.filter(child => child.classe === classe.value) || []
    return { 
      liste, 
      count: liste.length.toString().padStart(2, '0') 
    }
  }
})



//Exam Classes

const examClassInfos =computed(()=>childrenExamClass.value)

console.log(examClassInfos.value)
// Statistiques des cartes d'affichage
const cardInfos = computed(() => {
  const boys = totalBoy.value?.filter(child => child.classe === classe.value).length || 0
  const girls = totalGirl.value?.filter(child => child.classe === classe.value).length || 0

  const cm2Count = examClassInfos.value['CM2']?.length || 0
  console.log(cm2Count)
  const troisieCount = examClassInfos.value['3e']?.length || 0
  const tleCount = examClassInfos.value['Tle']?.length || 0
  
  return {
    boyStats: boys,
    girlStats: girls,
    examStats: cm2Count + troisieCount + tleCount
  }
})

const totalChildren = computed(() => {
  return childrenPerClass.value[classe.value]?.length || 0
})

const cardInfosRate = computed(() => {
  const total = totalChildren.value || 1
  return {
    boyStats: cardInfos.value.boyStats / total,
    girlStats: cardInfos.value.girlStats / total
  }
})

// Hydratation au cycle de vie (Optionnel mais sécuritaire si vos stores requièrent un fetch)
onMounted(async () => {
  try {
    // On lance les deux requêtes en parallèle pour aller plus vite
      await fetchAllChildren()
      await fetchAllEventData()
  } catch (error) {
    toast.error("Erreur lors du chargement des données au montage:")
  }
})
</script>