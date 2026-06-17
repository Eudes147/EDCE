<template>
  <div class="p-3 sm:p-4 md:p-6 max-w-7xl mx-auto w-full space-y-4 md:space-y-8">
    
    <div class="flex justify-between items-end px-1">
      <div>
        <h2 class="font-h1 text-lg sm:text-xl md:text-2xl font-bold text-on-background">Registre des Séances</h2>
        <p class="font-body text-[11px] sm:text-xs md:text-sm text-on-surface-variant mt-1">
          Visualisez, modifiez et supprimez les séances d'enseignement de l'année {{ actualYear }}.
        </p>
      </div>
    </div>

    <section class="overflow-hidden bg-white rounded-xl shadow-sm border border-outline-variant/60">
      <div class="p-4 md:p-6 border-b border-outline-variant/40 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <h3 class="font-h3 text-sm sm:text-base md:text-h3 flex items-center gap-2 font-semibold text-on-surface">
          <Icon name="school" class="text-primary" size="1.25rem" />
          Liste des Séances créées cette année
        </h3>
        
        <div class="flex flex-row items-center gap-2.5 sm:gap-3 w-full lg:w-auto justify-start lg:justify-end">
          <select 
            v-model="monthSelected" 
            class="bg-surface-container-low border border-outline-variant rounded-lg text-xs md:text-sm px-2.5 py-2 focus:ring-2 focus:ring-primary focus:outline-none text-on-surface cursor-pointer flex-1 sm:flex-none min-w-[110px] sm:min-w-[130px]"
          >
            <option v-for="month in months" :key="month" :value="month">
              {{ month.charAt(0).toUpperCase() + month.slice(1) }}
            </option>
          </select>

          <select 
            v-model="classeSelected" 
            class="bg-surface-container-low border border-outline-variant rounded-lg text-xs md:text-sm px-2.5 py-2 focus:ring-2 focus:ring-primary focus:outline-none text-on-surface cursor-pointer flex-1 sm:flex-none min-w-[110px] sm:min-w-[130px]"
          >
            <option v-for="child_classe in classes" :key="child_classe" :value="child_classe">
              {{ child_classe }}
            </option>
          </select>
        </div>
      </div>

      <div class="overflow-x-auto custom-scrollbar">
        <table class="w-full text-left border-collapse table-fixed lg:table-auto">
          <thead class="bg-surface-container-low border-b border-outline-variant/40">
            <tr>
              <th class="px-4 py-3.5 md:px-6 font-caption text-[11px] md:text-xs uppercase tracking-wider font-semibold text-on-surface-variant/80 w-[45%] lg:w-auto">Titre</th>
              <th class="px-4 py-3.5 md:px-6 font-caption text-[11px] md:text-xs uppercase tracking-wider font-semibold text-on-surface-variant/80 w-[20%] lg:w-auto max-md:hidden">Type</th>
              <th class="px-4 py-3.5 md:px-6 font-caption text-[11px] md:text-xs uppercase tracking-wider font-semibold text-on-surface-variant/80 w-[15%] lg:w-auto max-md:hidden">Classe</th>
              <th class="px-4 py-3.5 md:px-6 font-caption text-[11px] md:text-xs uppercase tracking-wider font-semibold text-on-surface-variant/80 text-right w-[20%] min-w-[120px] lg:w-48 ">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant/30">
            <tr 
              v-for="seance in getSeancebyMonthAndClasse" 
              :key="seance.id" 
              class="hover:bg-surface-container-low/50 transition-colors group">
              <td class="px-5 py-5 md:px-6 align-middle">
                <div class="inline-block bg-primary/5 text-primary px-3 py-2 rounded-lg font-semibold text-xs md:text-sm border border-primary/10 leading-snug">
                  {{ seance.title }}
                </div>
              </td>

              <td class="px-5 py-5 md:px-6 align-middle  max-md:hidden">
                <span class="inline-block px-3 py-1 bg-surface-container rounded-md text-[10px] md:text-xs font-mono tracking-wide text-on-surface-variant font-medium uppercase border border-outline-variant/20">
                  {{ seance.type }}
                </span>
              </td>

              <td class="px-5 py-5 md:px-6 font-body text-xs md:text-sm text-on-surface font-medium whitespace-nowrap align-middle  max-md:hidden">
                {{ seance.classe }}
              </td>

              <td class="px-2 py-2 md:px-6 text-right align-middle">
                <div class="flex items-center justify-end gap-2 sm:gap-3">
                  <button 
                    @click="view(seance)" 
                    class="p-1 md:p-2 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-lg transition-all" 
                    title="Voir les détails"
                  >
                    <Icon name="visibility" size="1.25rem" />
                  </button>
                  <button v-if="authStore.isAdmin || permissionsLocal.canEditSeance"
                    @click="edit(seance)" 
                    class="p-1 md:p-2 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-lg transition-all" 
                    title="Modifier"
                  >                  
                    <Icon name="edit" size="1.25rem" />
                  </button>
                  <button v-if="authStore.isAdmin"
                    @click="supprimer(seance)" 
                    class="p-1 md:p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg transition-all" 
                    title="Supprimer"
                  >
                    <Icon name="delete" size="1.25rem" />
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="isLoading">
              <td colspan="4" class="px-6 py-12 text-center text-on-surface-variant text-xs md:text-sm font-medium">
                <span class="inline-block">
                  <svg 
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
      </svg>
                </span> Chargement...
              </td>
            </tr>
            <tr v-else-if="!getSeancebyMonthAndClasse || getSeancebyMonthAndClasse.length === 0">
              <td colspan="4" class="px-6 py-16 text-center text-on-surface-variant italic text-xs md:text-sm">
                Aucune séance trouvée pour la classe <span class="font-semibold text-primary not-italic">{{ classeSelected }}</span> en {{ monthSelected }}.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <Modal v-model="showViewModal" title="Détails de la séance" size="md">
      <div v-if="seanceModal" class="space-y-4 py-1">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/40">
          <div class="sm:col-span-2">
            <p class="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">Thème / Titre</p>
            <p class="font-bold text-on-surface text-sm sm:text-base mt-0.5 leading-snug">{{ seanceModal.title }}</p>
          </div>
          <div>
            <p class="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">Type de rassemblement</p>
            <p class="font-semibold text-primary text-xs sm:text-sm mt-0.5">{{ seanceModal.type }}</p>
          </div>
          <div>
            <p class="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">Classe assignée</p>
            <p class="font-semibold text-on-surface text-xs sm:text-sm mt-0.5">{{ seanceModal.classe }}</p>
          </div>
          <div>
            <p class="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">Date de tenue</p>
            <p class="font-medium text-on-surface text-xs sm:text-sm mt-0.5">{{ formatDate(seanceModal.created_at) }}</p>
          </div>
          <div>
            <p class="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">Créé(e) par</p>
            <p class="font-semibold text-on-surface text-xs sm:text-sm mt-0.5">
              {{ getAuthorSupervisorbySeance(seanceModal)?.authorName || 'Moniteur non renseigné' }}
            </p>
          </div>
          <div class="sm:col-span-2">
            <p class="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">Supervisé par</p>
            <p class="font-medium text-on-surface-variant text-xs sm:text-sm mt-0.5">
              {{ getAuthorSupervisorbySeance(seanceModal)?.supervisorName || 'Aucun superviseur' }}
            </p>
          </div>
          <div class="sm:col-span-2 border-t border-outline-variant/40 pt-3 mt-1">
            <p class="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">Identifiant Technique</p>
            <p class="font-mono text-[11px] sm:text-xs text-primary bg-primary/5 border border-primary/10 px-2 py-1 rounded mt-1 break-all font-semibold">{{ seanceModal.id }}</p>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex flex-col sm:flex-row justify-between items-center w-full gap-2">
          <button 
            v-if="seanceModal"
            class="flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-sm text-xs sm:text-sm w-full sm:w-auto"
            @click="openParticipantsFromView"
          >
            <Icon name="groups" size="1.1rem" />
            Voir les participants
          </button>
          
          <button class="px-4 py-2 border border-outline-variant rounded-lg text-on-surface transition-colors hover:bg-surface-container text-xs sm:text-sm font-medium w-full sm:w-auto sm:ml-auto" @click="showViewModal = false">Fermer</button>
        </div>
      </template>
    </Modal>

    <Modal v-model="showEditModal" title="Modifier la séance" size="md">
      <div v-if="seanceModal" class="space-y-4 py-1">
        <form @submit.prevent="handleUpdate" id="editSeanceForm" class="space-y-4">
          <div>
            <label class="block font-caption text-[10px] sm:text-xs font-bold text-on-surface-variant uppercase tracking-wide mb-1.5">Titre de la Séance</label>
            <input 
              v-model="seanceModal.title" 
              class="w-full bg-white border border-outline-variant rounded-lg text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-medium" 
              type="text" 
              required 
            />
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block font-caption text-[10px] sm:text-xs font-bold text-on-surface-variant uppercase tracking-wide mb-1.5">Type</label>
              <select v-model="seanceModal.type" class="w-full bg-white border border-outline-variant rounded-lg text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-medium cursor-pointer">
                <option v-for="typeS in typeSeances" :key="typeS" :value="typeS">{{ typeS }}</option>
              </select>
            </div>
            <div>
              <label class="block font-caption text-[10px] sm:text-xs font-bold text-on-surface-variant uppercase tracking-wide mb-1.5">Classe</label>
              <select v-model="seanceModal.classe" class="w-full bg-white border border-outline-variant rounded-lg text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-medium cursor-pointer">
                <option v-for="c in classes" :key="c" :value="c">{{ c }}</option>
              </select>
            </div>
          </div>
        </form>
      </div>
      <template #footer>
        <div class="flex flex-col sm:flex-row gap-2 w-full justify-end">
          <button type="button" class="px-4 py-2 border border-outline-variant rounded-lg text-on-surface hover:bg-surface-container transition-colors text-xs sm:text-sm font-medium order-2 sm:order-1" @click="showEditModal = false">Annuler</button>
          <button type="submit" form="editSeanceForm" class="px-5 py-2 bg-primary text-white rounded-lg shadow-sm font-semibold text-xs sm:text-sm hover:opacity-90 transition-opacity order-1 sm:order-2" :disabled="isLoading">Enregistrer</button>
        </div>
      </template>
    </Modal>

    <Modal v-model="showDeleteModal" title="Supprimer la séance" size="sm">
      <div v-if="seanceModal" class="space-y-3 text-center py-2">
        <div class="w-11 h-11 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto">
          <Icon name="delete" size="1.3rem" />
        </div>
        <p class="text-xs sm:text-sm md:text-base font-medium text-on-surface">Êtes-vous sûr de vouloir supprimer définitivement cette séance ? Tous les émargements associés seront perdus.</p>
        <p class="text-xs sm:text-sm font-bold text-error bg-error/5 p-2 rounded border border-error/20 break-words max-w-full">
          {{ seanceModal.title }}
        </p>
      </div>
      <template #footer>
        <div class="flex flex-col sm:flex-row gap-2 w-full">
          <button class="px-4 py-2 border border-outline-variant rounded-lg text-on-surface w-full hover:bg-surface-container-low transition-colors text-xs sm:text-sm font-medium order-2 sm:order-1" @click="showDeleteModal = false">Annuler</button>
          <button class="px-4 py-2 bg-error text-white rounded-lg w-full hover:opacity-90 transition-opacity text-xs sm:text-sm font-medium order-1 sm:order-2" @click="confirmDelete" :disabled="isLoading">Supprimer</button>
        </div>
      </template>
    </Modal>

    <Modal v-model="showParticipantsModal" title="Liste des Participants" size="lg">
      <div v-if="seanceModal" class="space-y-4 py-1">
        <div class="bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/40 flex flex-col gap-0.5">
          <span class="text-[9px] sm:text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">Séance sélectionnée</span>
          <h4 class="font-bold text-sm sm:text-base text-on-surface leading-tight">{{ seanceModal.title }}</h4>
          <p class="text-xs text-on-surface-variant flex items-center gap-2 mt-0.5">
            <span class="px-1.5 py-0.5 bg-primary/10 text-primary text-[10px] sm:text-xs rounded font-semibold">{{ seanceModal.classe }}</span>
            <span class="text-on-surface-variant/50">•</span> 
            <span class="font-medium">{{ formatDate(seanceModal.created_at) }}</span>
          </p>
        </div>

        <div class="space-y-2.5">
          <div class="flex justify-between items-center border-b border-outline-variant/40 pb-2">
            <span class="font-bold text-[10px] sm:text-xs uppercase tracking-wide text-on-surface-variant">Élèves présents</span>
            <span class="px-2 py-0.5 bg-secondary/10 text-secondary text-[11px] rounded-full font-bold">
              {{ currentSeanceParticipants.length }} inscrit(s)
            </span>
          </div>

          <div v-if="currentSeanceParticipants.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
            <div 
              v-for="child in currentSeanceParticipants" 
              :key="child.id"
              class="flex items-center gap-3 p-2.5 bg-surface-container-low/40 rounded-xl border border-outline-variant/40 hover:border-outline-variant transition-all"
            >
              <div class="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px] uppercase flex-shrink-0">
                {{ child.name.substring(0, 2) }}
              </div>
              <div class="flex flex-col min-w-0">
                <span class="font-body text-xs sm:text-sm text-on-surface font-semibold truncate">{{ child.name }}</span>
                <span v-if="child.nivScolaire" class="text-[11px] text-on-surface-variant font-medium truncate">{{ child.nivScolaire }}</span>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-8 border border-dashed border-outline-variant rounded-xl bg-surface-container-low/30">
            <Icon name="face" size="1.8rem" class="text-on-surface-variant/40 mb-1.5 mx-auto" />
            <p class="font-body text-xs italic text-on-surface-variant">Aucun enfant n'a été émargé présent pour cette séance.</p>
          </div>
        </div>
      </div>
      <template #footer>
        <button class="px-4 py-2 border border-outline-variant rounded-lg text-on-surface transition-colors hover:bg-surface-container text-xs sm:text-sm font-medium ml-auto" @click="showParticipantsModal = false">Fermer</button>
      </template>
    </Modal>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { height: 5px; width: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #E8E4DE; border-radius: 10px; }
</style>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { classes } from '~/stores/child'
import { useSeance } from '~/composables/useSeance'
import { useParticipantSeance } from '~/composables/useParticipant'
import { useToast } from '~/composables/useToast'
import type { ClasseType } from '~/types/classe'
import type { Month } from '~/types/index'
import type { Seance } from '~/types/seance'
import {useAuthStore} from '~/stores/auth'

definePageMeta({
  layout: 'dashboard'
})

// Stores
// Composables
const toast = useToast()
const { groupSeanceperYear, typeSeances, fetchAllSeances, updateSeance, deleteSeance, isLoading } = useSeance()
// Extraction de 'getChildbySeanceId' depuis ton composable
const { getAuthorSupervisorbySeance, fetchAllSeanceData, getChildbySeanceId } = useParticipantSeance()

// États d'affichage & Modales
const showViewModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const showParticipantsModal = ref(false)
const seanceModal = ref<Seance | null>(null)

// Filtres de recherche
const classeSelected = ref<ClasseType>("Petit")
const monthSelected = ref<Month>('janvier')
const actualYear = computed(() => new Date().getFullYear().toString())

const months = ref<Month[]>([
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin', 
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
])
const permissionsLocal=ref()

// Cycle de vie : Charger les données
onMounted(async () => {
  await fetchAllSeances()
  await fetchAllSeanceData()
})

// --- 👥 LOGIQUE FILTRE PARTICIPANTS ---
// Récupère dynamiquement la liste des enfants de la séance ouverte dans la modale

const authStore=useAuthStore()
if(authStore.permissions && authStore.userStatus) permissionsLocal.value=authStore.permissions[authStore.userStatus]
const currentSeanceParticipants = computed(() => {
  if (!seanceModal.value?.id) return []
  return getChildbySeanceId(seanceModal.value.id)
})

// --- LOGIQUE FILTRES COMPUTED SÉANCES ---
const getSeanceActualYear = computed(() => {
  return groupSeanceperYear.value[actualYear.value] || []
})

const getSeancebyMonthAndClasse = computed(() => {
  return getSeanceActualYear.value.filter(seance => {
    if (!seance.created_at) return false
    const seanceMonth = new Date(seance.created_at).toLocaleString('fr-FR', { month: 'long' })
    return seanceMonth.toLowerCase() === monthSelected.value && seance.classe === classeSelected.value
  })
})

// Formateur de date utilitaire
const formatDate = (dateStr: string | Date) => {
  if (!dateStr) return '-'
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateStr).toLocaleDateString('fr-FR', options)
}

// --- GESTIONNAIRES ACTIONS ---
const view = (seance: Seance) => {
  seanceModal.value = { ...seance }
  showViewModal.value = true
}

const openParticipantsFromView = () => {
  showViewModal.value = false
  showParticipantsModal.value = true
}

const edit = (seance: Seance) => {
  seanceModal.value = { ...seance }
  showEditModal.value = true
}

const supprimer = (seance: Seance) => {
  seanceModal.value = seance
  showDeleteModal.value = true
}

const handleUpdate = async () => {
  if (!seanceModal.value) return
  try {
    await updateSeance(seanceModal.value.id, {
      title: seanceModal.value.title,
      type: seanceModal.value.type,
      classe: seanceModal.value.classe
    })
    toast.success('Séance mise à jour', 'Les détails du cours ont été modifiés.')
    showEditModal.value = false
  } catch (err) {
    toast.error('Erreur', 'Impossible de modifier la séance.')
  }
}

const confirmDelete = async () => {
  if (!seanceModal.value) return
  const title = seanceModal.value.title
  try {
    await deleteSeance(seanceModal.value.id)
    toast.success('Séance annulée', `La séance "${title}" a été supprimée.`);
    showDeleteModal.value = false
    seanceModal.value = null
  } catch (err) {
    toast.error('Erreur d\'annulation', 'Le serveur a bloqué la suppression de cette séance.')
  }
}
</script>