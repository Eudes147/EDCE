<template>
  <!-- HEADER BAR -->
  <header class="flex justify-between items-center w-full px-4 md:px-8 py-3 h-16 bg-background border-b border-outline-variant sticky top-0 z-20">
    <div class="flex items-center gap-4">
      <h2 class="font-h3 text-base md:text-h3 font-semibold text-on-surface">Gestion des Événements</h2>
    </div>
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 rounded-full overflow-hidden border border-outline-variant bg-surface-container"></div>
    </div>
  </header>

  <main class="p-4 md:p-8 max-w-7xl w-full mx-auto space-y-6 md:space-y-8">
    
    <!-- SECTION INTRODUCTION & FILTRES -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest p-4 md:p-6 rounded-xl border border-outline-variant/60 shadow-sm">
      <div class="max-w-xl">
        <h3 class="font-h2 text-lg md:text-h2 font-bold text-on-background mb-1">Calendrier & Activités Pédagogiques</h3>
        <p class="font-body text-xs md:text-sm text-on-surface-variant">Configurez les événements annuels et associez-y des ateliers ou animations spécifiques pour vos élèves.</p>
      </div>
      <div class="flex items-center gap-3 self-end md:self-auto w-full md:w-auto justify-end">
        <label class="font-caption text-xs md:text-sm text-on-surface-variant whitespace-nowrap">Année Scolaire :</label>
        <select v-model="year" class="px-3 py-2 bg-white border border-outline-variant rounded-lg text-xs md:text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none text-on-surface cursor-pointer min-w-[120px]">
          <option v-for="y in dynamicYears" :key="y" :value="y">{{ y }}</option>
        </select>
        
        <button class="px-3 py-2 text-xs md:text-sm font-medium border border-outline-variant rounded-lg flex items-center gap-2 hover:bg-surface-container-low transition-colors text-on-surface whitespace-nowrap">
          <Icon name="download" color="1.1rem" />
          Exporter
        </button>
      </div>
    </div>

    <!-- TABLEAU PRINCIPAL DES ÉVÉNEMENTS -->
    <div class="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low text-on-surface-variant border-b border-outline-variant">
              <th class="px-6 py-4 font-caption text-xs uppercase tracking-wider font-semibold text-on-surface-variant/80">Type d'Événement</th>
              <th class="px-6 py-4 font-caption text-xs uppercase tracking-wider font-semibold text-on-surface-variant/80 text-center w-32">Année</th>
              <th class="px-6 py-4 font-caption text-xs uppercase tracking-wider font-semibold text-on-surface-variant/80">Activités Associées</th>
              <th class="px-6 py-4 font-caption text-xs uppercase tracking-wider font-semibold text-on-surface-variant/80 text-right w-48">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant/40">
            <tr v-for="eventItem in structuredEvents" :key="eventItem.type" class="hover:bg-surface-container-low/40 transition-colors group">
              
              <!-- Colonne Type Événement -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div :class="['w-10 h-10 rounded-lg flex items-center justify-center border flex-shrink-0', eventItem.iconBg]">
                    <Icon :name="eventItem.icon" :class="eventItem.iconColor" color="1.25rem" />
                  </div>
                  <div>
                    <p class="font-body text-sm font-semibold text-on-surface">{{ eventItem.label }}</p>
                    <p class="text-xs text-on-surface-variant">Événement périodique annuel</p>
                  </div>
                </div>
              </td>

              <!-- Colonne Année -->
              <td class="px-6 py-4 text-center">
                <span class="px-2.5 py-1 bg-surface-container rounded-md font-medium text-on-surface text-xs md:text-sm">{{ year }}</span>
              </td>

              <!-- Colonne Activités (Badges dynamiques) -->
              <td class="px-6 py-4">
                <div class="flex flex-wrap gap-1.5 items-center">
                  <span 
                    v-for="act in getAttachedActivities(eventItem.type)" 
                    :key="act.id" 
                    class="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 bg-primary/5 text-primary border border-primary/10 rounded-full"
                  >
                    {{ act.title }}
                  </span>
                  
                  <span v-if="getAttachedActivities(eventItem.type).length === 0" class="text-xs italic text-on-surface-variant/70">
                    Aucune activité associée à cet événement.
                  </span>
                </div>
              </td>

              <!-- Colonne d'Actions Opérationnelles -->
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button 
                    @click="openManageModal(eventItem.type, eventItem.label)"
                    class="bg-primary/5 text-primary px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-primary hover:text-white border border-primary/10 transition-all flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <Icon name="settings_suggest" color="1rem" />
                    Gérer les Activités
                  </button>

                  <div class="flex items-center gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity border-l border-outline-variant pl-2">
                    <button @click="openViewDetails(eventItem.type, eventItem.label)" class="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-md transition-colors" title="Visualiser">
                      <Icon name="visibility" color="1.1rem" />
                    </button>
                    <button @click="openCleanConfirm(eventItem.type, eventItem.label)" class="p-1.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-md transition-colors" title="Vider l'événement">
                      <Icon name="delete_sweep" color="1.1rem" />
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>

  <!-- MODAL : GESTION DES RELEGS D'ACTIVITÉS -->
  <Modal v-model="activeManageModal" :title="'Activités affectées : ' + modalContext.label" size="md">
    <div class="space-y-4 py-1">
      <p class="text-xs md:text-sm text-on-surface-variant">
        Cochez ou décochez les ateliers pour l'année <strong class="text-primary">{{ year }}</strong>. Chaque clic synchronise automatiquement l'association.
      </p>

      <div v-if="isLoading" class="py-8 text-center text-on-surface-variant text-sm flex items-center justify-center gap-2">
        <span class="inline-block animate-spin">🔄</span> Traitement réseau en cours...
      </div>

      <div v-else class="grid grid-cols-1 gap-2 max-h-[320px] overflow-y-auto pr-1">
        <label 
          v-for="activity in listActivities" 
          :key="activity.id"
          class="flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-all hover:bg-surface-container-low"
          :class="isActivityChecked(activity.id) ? 'border-primary/40 bg-primary/5' : 'border-outline-variant/60 bg-white'"
        >
          <div class="flex items-center gap-3">
            <input 
              type="checkbox" 
              :checked="isActivityChecked(activity.id)"
              @change="(e) => handleCheckboxToggle(activity.id, (e.target as HTMLInputElement).checked)"
              class="w-4.5 h-4.5 text-primary focus:ring-primary border-outline-variant rounded cursor-pointer"
            >
            <span class="font-body text-sm font-medium text-on-surface">{{ activity.title }}</span>
          </div>
          <span 
            :class="['text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider', isActivityChecked(activity.id) ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant']"
          >
            {{ isActivityChecked(activity.id) ? 'Associée' : 'Inactive' }}
          </span>
        </label>

        <div v-if="listActivities.length === 0" class="text-center py-6 border border-dashed rounded-xl border-outline-variant bg-surface-container-low">
          <p class="text-sm text-on-surface-variant">Aucune activité disponible dans le catalogue global.</p>
          <button @click="triggerCreateNewActivity" class="mt-2 text-xs text-primary font-bold underline">Créer une activité de base</button>
        </div>
      </div>
    </div>
    <template #footer>
      <button class="px-5 py-2.5 bg-primary text-white font-semibold rounded-lg shadow-sm w-full transition-opacity hover:opacity-90 text-sm" @click="activeManageModal = false">Terminer la configuration</button>
    </template>
  </Modal>

  <!-- MODAL : RÉCAPITULATIF REUNIFIÉ DE L'ÉVÉNEMENT (READ) -->
  <Modal v-model="activeViewModal" :title="'Vue d\'ensemble — ' + modalContext.label" size="md">
    <div class="space-y-4 py-1">
      <div class="bg-surface-container-low p-4 rounded-xl space-y-2 border border-outline-variant/30">
        <p class="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">Fiche Événement</p>
        <h4 class="text-base md:text-lg font-bold text-on-surface">{{ modalContext.label }} (Session {{ year }})</h4>
        <p class="text-xs md:text-sm text-on-surface-variant">Type technique enregistré : <code class="bg-white px-1.5 py-0.5 border rounded font-mono text-xs text-primary font-semibold">{{ modalContext.type }}</code></p>
      </div>

      <div>
        <h5 class="font-caption text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-wide">Liste finale des activités retenues :</h5>
        <ul class="divide-y border border-outline-variant rounded-xl overflow-hidden bg-white">
          <li v-for="(act, idx) in getAttachedActivities(modalContext.type)" :key="act.id" class="p-3 text-sm text-on-surface flex items-center gap-2">
            <span class="w-5 h-5 bg-primary/10 text-primary text-xs rounded-full flex items-center justify-center font-bold flex-shrink-0">{{ idx + 1 }}</span>
            <span class="font-medium">{{ act.title }}</span>
          </li>
          <li v-if="getAttachedActivities(modalContext.type).length === 0" class="p-4 text-center text-sm text-on-surface-variant italic bg-surface-container-lowest">
            Aucun atelier n'est planifié pour ce rassemblement.
          </li>
        </ul>
      </div>
    </div>
    <template #footer>
      <button class="px-4 py-2 border border-outline-variant rounded-lg text-on-surface w-full hover:bg-surface-container transition-colors text-sm font-medium" @click="activeViewModal = false">Fermer la vue</button>
    </template>
  </Modal>

  <!-- MODAL : CONFIRMATION DE PURGE COMPLÈTE DE L'ÉVÉNEMENT -->
  <Modal v-model="activeCleanModal" title="Vider l'événement ?" size="sm">
    <div class="space-y-3 text-center py-2">
      <div class="w-12 h-12 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto">
        <Icon name="delete_sweep" color="1.5rem" />
      </div>
      <p class="text-sm md:text-base font-medium text-on-surface">Êtes-vous sûr de vouloir dissocier <strong>toutes</strong> les activités liées à l'événement suivant pour {{ year }} ?</p>
      <p class="text-xs md:text-sm font-bold text-error bg-error/5 p-2 rounded border border-error/20 max-w-full break-words">{{ modalContext.label }}</p>
    </div>
    <template #footer>
      <div class="flex flex-col sm:flex-row gap-2 w-full">
        <button class="px-4 py-2 border border-outline-variant rounded-lg text-on-surface w-full hover:bg-surface-container-low transition-colors text-sm font-medium order-2 sm:order-1" @click="activeCleanModal = false">Annuler</button>
        <button class="px-4 py-2 bg-error text-white rounded-lg w-full hover:opacity-90 transition-opacity text-sm font-medium order-1 sm:order-2" @click="executePurgeEvent">Confirmer la désaffectation</button>
      </div>
    </template>
  </Modal>

  <!-- BOUTON D'ACTION RAPIDE FLOTTANT -->
  <div class="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40">
    <button 
      @click="promptGlobalActivityCreation"
      title="Créer une nouvelle activité dans le catalogue global"
      class="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
    >
      <Icon name="add_task" color="1.5rem" class="group-hover:rotate-12 transition-transform" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { definePageMeta } from '#imports'
import { useActivities } from '~/composables/useActivity'
import { useToast } from '~/composables/useToast'
import type { EventType } from '~/types/activity'

definePageMeta({
  layout: 'dashboard',
})

const toast = useToast()
const { 
  listActivities, 
  listActivityAtEvent, 
  isLoading, 
  fetchAllData, 
  syncEventActivity,
  createActivity,
  deleteActivityAtEvent 
} = useActivities()

// --- GESTION DYNAMIQUE ET CALCULÉE DES ANNÉES ---
const currentSystemYear = computed(() => new Date().getFullYear())
const year = ref<string>(currentSystemYear.value.toString())

const dynamicYears = computed<string[]>(() => {
  const current = currentSystemYear.value
  return [
    (current - 1).toString(), // Année précédente
    current.toString(),       // Année en cours
    (current + 1).toString()  // Année suivante
  ]
})

// --- CONFIGURATION EXCLUSIVE DES DEUX TYPES D'ÉVÉNEMENTS ---
interface EventStructure {
  type: EventType
  label: string
  icon: string
  iconColor: string
  iconBg: string
}

const structuredEvents: EventStructure[] = [
  {
    type: 'Arbre de noël',
    label: 'Arbre de Noël',
    icon: 'festival',
    iconColor: 'text-primary',
    iconBg: 'bg-primary/10 border-primary/20'
  },
  {
    type: 'Soirée récréative des enfants',
    label: 'Soirée Récréative des Enfants',
    icon: 'theater_comedy',
    iconColor: 'text-tertiary',
    iconBg: 'bg-tertiary/10 border-tertiary/20'
  }
]

// --- ÉTATS DES MODALES CONTEXTUELLES ---
const activeManageModal = ref(false)
const activeViewModal = ref(false)
const activeCleanModal = ref(false)
// On initialise avec une valeur valide du type au lieu d'une chaîne vide
const modalContext = ref<{ type: EventType; label: string }>({ 
  type: 'Arbre de noël', 
  label: '' 
})

onMounted(async () => {
  await fetchAllData()
})

// --- RÉSOLUTION DES ASSOCIATIONS (FILTRAGE CALCULÉ) ---
const getAttachedActivities = computed(() => {
  return (eventType: EventType) => {
    const currentRelations = listActivityAtEvent.value.filter(
      eventRel => eventRel.eventType === eventType && eventRel.year === year.value
    )
    
    return currentRelations.map(rel => {
      return listActivities.value.find(act => act.id === rel.activityId)
    }).filter((act): act is any => !!act)
  }
})

const isActivityChecked = computed(() => {
  return (activityId: string) => {
    return listActivityAtEvent.value.some(
      rel => rel.activityId === activityId && 
             rel.eventType === modalContext.value.type && 
             rel.year === year.value
    )
  }
})

// --- ACTIONS INTERFACES ---
const openManageModal = (type: EventType, label: string) => {
  modalContext.value = { type, label }
  activeManageModal.value = true
}

const openViewDetails = (type: EventType, label: string) => {
  modalContext.value = { type, label }
  activeViewModal.value = true
}

const openCleanConfirm = (type: EventType, label: string) => {
  modalContext.value = { type, label }
  activeCleanModal.value = true
}

const handleCheckboxToggle = async (activityId: string, isChecked: boolean) => {
  // 1. Le garde-fou : on extrait le type et on vérifie qu'il est bien défini
  const currentType = modalContext.value.type
  
  if (!currentType) {
    console.warn("Impossible de synchroniser : aucun type d'événement sélectionné.")
    return
  }

  // 2. Ici, TypeScript sait à 100% que currentType est de type 'EventType' (et non "")
  await syncEventActivity(activityId, currentType, year.value, isChecked)
}

const executePurgeEvent = async () => {
  if (!modalContext.value.type) return
  
  const relationsToPurge = listActivityAtEvent.value.filter(
    rel => rel.eventType === modalContext.value.type && rel.year === year.value
  )

  if (relationsToPurge.length === 0) {
    toast.warning('Opération annulée', 'Aucune activité n\'est associée à cet événement.')
    activeCleanModal.value = false
    return
  }

  try {
    isLoading.value = true
    await Promise.all(relationsToPurge.map(rel => deleteActivityAtEvent(rel.id)))
    await fetchAllData()
    toast.success('Événement vidé', 'Toutes les activités ont été dissociées avec succès.')
    activeCleanModal.value = false
  } catch (err) {
    toast.error('Erreur', 'Une erreur est survenue lors de la désaffectation globale.')
  } finally {
    isLoading.value = false
  }
}

const promptGlobalActivityCreation = async () => {
  const title = prompt("Saisissez l'intitulé de la nouvelle activité globale (ex: Pièce de théâtre) :")
  if (!title || !title.trim()) return

  await createActivity(title.trim())
}

const triggerCreateNewActivity = () => {
  activeManageModal.value = false
  setTimeout(() => {
    promptGlobalActivityCreation()
  }, 300)
}
</script>