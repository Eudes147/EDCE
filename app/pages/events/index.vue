<template>
  <main class="w-full bg-background overflow-x-hidden p-4 md:p-6 space-y-6 pb-24 md:pb-6">
    
    <!-- 📋 SECTION INTRODUCTION & FILTRES REPENSSÉE -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/30 pb-5">
      <div>
        <h2 class="font-h2 text-2xl md:text-3xl font-bold text-primary">Calendrier & Activités</h2>
        <p class="font-body-sm text-xs md:text-sm text-on-surface-variant">Configurez les événements annuels et associez-y des ateliers spécifiques.</p>
      </div>
      
      <div class="flex items-center gap-2 self-stretch sm:self-auto justify-end">
        <select v-model="year" class="w-full sm:w-auto px-3 py-2 bg-white border border-outline-variant rounded-xl text-xs md:text-sm font-medium focus:ring-2 focus:ring-primary/10 text-on-surface focus:outline-none cursor-pointer">
          <option v-for="y in dynamicYears" :key="y" :value="y">{{ y }}</option>
        </select>
        
        <button class="px-4 py-2 text-xs md:text-sm font-semibold border border-outline-variant rounded-xl flex items-center gap-2 bg-white hover:bg-surface-container-low transition-colors text-on-surface" @click="toast.info('Fonctionnalité à venir')">
          <Icon name="download" size="1.1rem" />
          <span class="hidden xs:inline">Exporter</span>
        </button>
      </div>
    </div>

    <!-- 🎴 GRILLE DES FICHES ÉVÉNEMENTS (Fini le calvaire visuel du tableau !) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div 
        v-for="eventItem in structuredEvents" 
        :key="eventItem.type" 
        class="glass-card flex flex-col justify-between ultra-shadow border border-outline-variant/60 hover:border-primary/40 transition-all duration-300 group"
      >
        <!-- Haut de la carte : En-tête de l'événement -->
        <div class="p-5 border-b border-outline-variant/30 bg-surface-container-low/30 rounded-t-2xl">
          <div class="flex items-start justify-between gap-4">
            <div class="flex items-center gap-3.5">
              <div :class="['w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 shadow-sm', eventItem.iconBg]">
                <Icon :name="eventItem.icon" :class="eventItem.iconColor" size="1.4rem" />
              </div>
              <div>
                <h3 class="font-h3 text-base md:text-lg font-bold text-on-surface group-hover:text-primary transition-colors">{{ eventItem.label }}</h3>
                <p class="text-xs text-on-surface-variant mt-0.5">Session Annuelle <span class="font-mono font-bold text-primary bg-primary/5 px-1.5 py-0.2 rounded border border-primary/10 ml-1">{{ year }}</span></p>
              </div>
            </div>

            <!-- Compteur dynamique d'activités -->
            <span class="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 bg-surface-container text-on-surface-variant rounded-full border border-outline-variant/40 shrink-0">
              <Icon name="tag" size="0.9rem" />
              {{ getAttachedActivities(eventItem.type).length }} {{ getAttachedActivities(eventItem.type).length > 1 ? 'ateliers' : 'atelier' }}
            </span>
          </div>
        </div>

        <!-- Centre de la carte : Zone dédiée et ordonnée pour les Activités -->
        <div class="p-5 flex-1 bg-white">
          <p class="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/80 mb-3">Ateliers et Animations planifiés</p>
          
          <!-- Conteneur avec Scroll interne si trop d'activités -->
          <div class="max-h-[168px] overflow-y-auto custom-scrollbar pr-1 space-y-2">
            <div 
              v-for="act in getAttachedActivities(eventItem.type)" 
              :key="act.id" 
              class="flex items-center gap-2.5 px-3 py-2 bg-surface-container-lowest border border-outline-variant/40 rounded-xl hover:bg-primary/5 hover:border-primary/20 transition-all"
            >
              <div class="w-2 h-2 rounded-full bg-primary/60 shrink-0"></div>
              <span class="text-xs md:text-sm font-medium text-on-surface truncate">{{ act.title }}</span>
            </div>
            
            <!-- État vide épuré -->
            <div v-if="getAttachedActivities(eventItem.type).length === 0" class="flex flex-col items-center justify-center py-8 px-4 text-center border border-dashed border-outline-variant/60 rounded-xl bg-surface-container-low/20">
              <Icon name="layers_clear" size="1.5rem" class="text-on-surface-variant/40 mb-1.5" />
              <p class="text-xs italic text-on-surface-variant/70">Aucune activité associée à cet événement pour le moment.</p>
            </div>
          </div>
        </div>

        <!-- Bas de la carte : Barre d'actions unifiée et accessible (PC et Mobile) -->
        <div class="p-4 bg-surface-container-low/40 border-t border-outline-variant/30 rounded-b-2xl flex items-center justify-between gap-2">
          <button 
            @click="openManageModal(eventItem.type, eventItem.label)"
            class="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-xs font-semibold shadow-sm hover:opacity-90 active:scale-98 transition-all"
          >
            <Icon name="settings_suggest" size="1.1rem" />
            Gérer les activités
          </button>

          <div class="flex items-center gap-1 border-l border-outline-variant/50 pl-2">
            <button 
              @click="openViewDetails(eventItem.type, eventItem.label)" 
              class="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-xl transition-colors" 
              title="Aperçu global"
            >
              <Icon name="visibility" size="1.20rem" />
            </button>
            <button 
              @click="openCleanConfirm(eventItem.type, eventItem.label)" 
              class="p-2 text-on-surface-variant hover:text-error hover:bg-error/5 rounded-xl transition-colors" 
              title="Vider l'événement"
            >
              <Icon name="delete_sweep" size="1.20rem" />
            </button>
          </div>
        </div>
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
        <span class="inline-block"><svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24"
        class="w-4 h-4 sm:w-8 sm:h-8 md:w-12 md:h-12 fill-primary"
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
      </svg></span> Traitement réseau en cours...
      </div>

      <div v-else class="grid grid-cols-1 gap-2 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar">
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
      <button class="px-5 py-2.5 bg-primary text-white font-semibold rounded-xl shadow-sm w-full transition-opacity hover:opacity-90 text-sm" @click="activeManageModal = false">Terminer la configuration</button>
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
        <ul class="divide-y border border-outline-variant rounded-xl overflow-hidden bg-white custom-scrollbar">
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
      <button class="px-4 py-2 border border-outline-variant rounded-xl text-on-surface w-full hover:bg-surface-container transition-colors text-sm font-medium" @click="activeViewModal = false">Fermer la vue</button>
    </template>
  </Modal>

  <!-- MODAL : CONFIRMATION DE PURGE COMPLÈTE DE L'ÉVÉNEMENT -->
  <Modal v-model="activeCleanModal" title="Vider l'événement ?" size="sm">
    <div class="space-y-3 text-center py-2">
      <div class="w-12 h-12 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto">
        <Icon name="delete_sweep" size="1.5rem" />
      </div>
      <p class="text-sm md:text-base font-medium text-on-surface">Êtes-vous sûr de vouloir dissocier <strong>toutes</strong> les activités liées à l'événement suivant pour {{ year }} ?</p>
      <p class="text-xs md:text-sm font-bold text-error bg-error/5 p-2 rounded border border-error/20 max-w-full break-words">{{ modalContext.label }}</p>
    </div>
    <template #footer>
      <div class="flex flex-col sm:flex-row gap-2 w-full">
        <button class="px-4 py-2 border border-outline-variant rounded-xl text-on-surface w-full hover:bg-surface-container-low transition-colors text-sm font-medium order-2 sm:order-1" @click="activeCleanModal = false">Annuler</button>
        <button class="px-4 py-2 bg-error text-white rounded-xl w-full hover:opacity-90 transition-opacity text-sm font-medium order-1 sm:order-2" @click="executePurgeEvent">Confirmer la désaffectation</button>
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
      <Icon name="add_task" size="1.5rem" class="group-hover:rotate-12 transition-transform" />
    </button>
  </div>
</template>

<style scoped>
.ultra-shadow { box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
.glass-card { background: #FFFFFF; border: 1px solid #E8E4DE; border-radius: 16px; }
.custom-scrollbar::-webkit-scrollbar { height: 4px; width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #E8E4DE; border-radius: 10px; }
</style>

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