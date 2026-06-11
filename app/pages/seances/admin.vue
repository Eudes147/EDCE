<template>
  <div class="p-6 max-w-7xl mx-auto w-full space-y-8">
    <div class="flex justify-between items-end">
      <div>
        <h2 class="font-h1 text-h1 text-on-background text-2xl font-bold">Registre des Séances</h2>
        <p class="font-body text-body text-on-surface-variant mt-1">
          Visualisez, modifiez et supprimez les séances d'enseignement de l'année {{ actualYear }}.
        </p>
      </div>
    </div>

    <section class="section-card overflow-hidden bg-white rounded-xl shadow-sm border border-outline-variant/20">
      <div class="p-6 border-b border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 class="font-h3 text-h3 flex items-center gap-2 font-semibold">
          <Icon name="school" class="text-primary" />
          Liste des Séances créées cette année
        </h3>
        
        <div class="flex items-center gap-3">
          <select 
            v-model="monthSelected" 
            class="bg-surface-container-low border border-outline-variant/30 rounded-lg text-small px-4 py-2 focus:ring-primary focus:outline-none text-doomu-text"
          >
            <option v-for="month in months" :key="month" :value="month">
              {{ month.charAt(0).toUpperCase() + month.slice(1) }}
            </option>
          </select>

          <select 
            v-model="classeSelected" 
            class="bg-surface-container-low border border-outline-variant/30 rounded-lg text-small px-4 py-2 focus:ring-primary focus:outline-none text-doomu-text"
          >
            <option v-for="child_classe in classes" :key="child_classe" :value="child_classe">
              {{ child_classe }}
            </option>
          </select>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-surface-container-low border-b border-outline-variant/30">
            <tr>
              <th class="px-6 py-4 font-caption text-caption uppercase tracking-wider text-outline">Titre</th>
              <th class="px-6 py-4 font-caption text-caption uppercase tracking-wider text-outline">Type</th>
              <th class="px-6 py-4 font-caption text-caption uppercase tracking-wider text-outline">Classe</th>
              <th class="px-6 py-4 font-caption text-caption uppercase tracking-wider text-outline text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant/20">
            <tr 
              v-for="seance in getSeancebyMonthAndClasse" 
              :key="seance.id" 
              class="hover:bg-surface-container-low transition-colors"
            >
              <td class="px-6 py-4 flex items-center gap-3">
                <div class="bg-primary/10 text-primary px-3 py-1.5 rounded-lg font-medium text-small">
                  {{ seance.title }}
                </div>
              </td>
              <td class="px-6 py-4 text-body text-doomu-text">
                <span class="px-2 py-1 bg-surface-variant rounded text-xs font-mono tracking-wide">
                  {{ seance.type }}
                </span>
              </td>
              <td class="px-6 py-4 text-body text-doomu-text">{{ seance.classe }}</td>

              <td class="px-6 py-4 text-right space-x-1">
                <button 
                  @click="view(seance)" 
                  class="p-2 text-outline hover:text-primary hover:bg-primary/5 rounded-lg transition-colors" 
                  title="Voir les détails"
                >
                  <Icon name="visibility" class="text-[20px]" />
                </button>
                <button 
                  @click="edit(seance)" 
                  class="p-2 text-outline hover:text-primary hover:bg-primary/5 rounded-lg transition-colors" 
                  title="Modifier"
                >
                  <Icon name="edit" class="text-[20px]"/>
                </button>
                <button 
                  @click="supprimer(seance)" 
                  class="p-2 text-outline hover:text-error hover:bg-error/5 rounded-lg transition-colors" 
                  title="Supprimer"
                >
                  <Icon name="delete" class="text-[20px]"/>
                </button>
              </td>
            </tr>

            <tr v-if="isLoading">
              <td colspan="4" class="px-6 py-10 text-center text-doomu-text-muted font-body">
                Chargement des séances...
              </td>
            </tr>
            <tr v-else-if="!getSeancebyMonthAndClasse || getSeancebyMonthAndClasse.length === 0">
              <td colspan="4" class="px-6 py-10 text-center text-doomu-text-muted font-body">
                Aucune séance trouvée pour la classe <span class="font-semibold text-primary">{{ classeSelected }}</span> en {{ monthSelected }}.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- 🔍 MODALE : DÉTAILS DE LA SÉANCE -->
    <Modal v-model="showViewModal" title="Détails de la séance" size="md">
      <div v-if="seanceModal" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-xs text-doomu-text-muted uppercase tracking-wider">Identifiant</p>
            <p class="font-mono text-xs text-doomu-text bg-doomu-bg p-1 rounded mt-0.5 break-all">{{ seanceModal.id }}</p>
          </div>
          <div>
            <p class="text-xs text-doomu-text-muted uppercase tracking-wider">Type de rassemblement</p>
            <p class="font-medium text-doomu-text mt-0.5">{{ seanceModal.type }}</p>
          </div>
          <div class="col-span-2">
            <p class="text-xs text-doomu-text-muted uppercase tracking-wider">Thème / Titre</p>
            <p class="font-semibold text-doomu-text text-base mt-0.5">{{ seanceModal.title }}</p>
          </div>
          <div>
            <p class="text-xs text-doomu-text-muted uppercase tracking-wider">Classe assignée</p>
            <p class="font-medium text-doomu-text mt-0.5">{{ seanceModal.classe }}</p>
          </div>
          <div>
            <p class="text-xs text-doomu-text-muted uppercase tracking-wider">Date de tenue</p>
            <p class="font-medium text-doomu-text mt-0.5">{{ formatDate(seanceModal.created_at) }}</p>
          </div>
          <div>
            <p class="text-xs text-doomu-text-muted uppercase tracking-wider">Créé(e) par</p>
            <p class="font-medium text-primary mt-0.5">
              {{ getAuthorSupervisorbySeance(seanceModal)?.authorName || 'Moniteur non renseigné' }}
            </p>
          </div>
          <div>
            <p class="text-xs text-doomu-text-muted uppercase tracking-wider">Supervisé par</p>
            <p class="font-medium text-doomu-text mt-0.5">
              {{ getAuthorSupervisorbySeance(seanceModal)?.supervisorName || 'Aucun superviseur' }}
            </p>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-between items-center w-full">
          <button 
            v-if="seanceModal"
            class="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg font-label-md hover:bg-secondary-dark transition-colors shadow-sm"
            @click="openParticipantsFromView"
          >
            <Icon name="groups" class="text-[18px]" />
            Voir les participants
          </button>
          
          <button class="px-4 py-2 bg-doomu-bg hover:bg-doomu-border rounded-lg text-doomu-text transition-colors" @click="showViewModal = false">Fermer</button>
        </div>
      </template>
    </Modal>

    <!-- 📝 MODALE : MODIFIER LA SÉANCE -->
    <Modal v-model="showEditModal" title="Modifier la séance" size="md">
      <div v-if="seanceModal" class="space-y-4">
        <form @submit.prevent="handleUpdate" id="editSeanceForm" class="space-y-4">
          <div>
            <label class="block font-caption text-caption text-outline mb-1.5">Titre de la Séance</label>
            <input 
              v-model="seanceModal.title" 
              class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg text-small px-4 py-2.5 text-doomu-text focus:outline-none focus:border-primary" 
              type="text" 
              required 
            />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block font-caption text-caption text-outline mb-1.5">Type</label>
              <select v-model="seanceModal.type" class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg text-small px-4 py-2.5 text-doomu-text focus:outline-none">
                <option v-for="typeS in typeSeances" :key="typeS" :value="typeS">{{ typeS }}</option>
              </select>
            </div>
            <div>
              <label class="block font-caption text-caption text-outline mb-1.5">Classe</label>
              <select v-model="seanceModal.classe" class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg text-small px-4 py-2.5 text-doomu-text focus:outline-none">
                <option v-for="c in classes" :key="c" :value="c">{{ c }}</option>
              </select>
            </div>
          </div>
        </form>
      </div>
      <template #footer>
        <button type="button" class="px-4 py-2 border border-doomu-border rounded-lg text-doomu-text hover:bg-doomu-bg" @click="showEditModal = false">Annuler</button>
        <button type="submit" form="editSeanceForm" class="px-6 py-2 bg-primary text-white rounded-lg shadow-sm" :disabled="isLoading">Enregistrer</button>
      </template>
    </Modal>

    <!-- ❌ MODALE : SUPPRIMER LA SÉANCE -->
    <Modal v-model="showDeleteModal" title="Supprimer la séance" size="sm">
      <div v-if="seanceModal" class="space-y-3 text-center py-2">
        <div class="w-12 h-12 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto">
          <Icon name="delete" class="text-[24px]" />
        </div>
        <p class="text-body font-medium text-doomu-text">Êtes-vous sûr de vouloir supprimer définitivement cette séance ? Tous les émargements associés seront perdus.</p>
        <p class="text-sm font-bold text-error bg-error/5 p-2 rounded border border-error/20 break-words">
          {{ seanceModal.title }}
        </p>
      </div>
      <template #footer>
        <button class="px-4 py-2 border border-doomu-border rounded-lg text-doomu-text w-full hover:bg-doomu-bg" @click="showDeleteModal = false">Annuler</button>
        <button class="px-4 py-2 bg-error text-white rounded-lg w-full hover:bg-error-dark" @click="confirmDelete" :disabled="isLoading">Supprimer</button>
      </template>
    </Modal>

    <!-- 👥 MODALE : LISTE DES PARTICIPANTS INSÉRÉE ICI -->
    <Modal v-model="showParticipantsModal" title="Liste des Participants" size="lg">
      <div v-if="seanceModal" class="space-y-5">
        <div class="bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 flex flex-col gap-1">
          <span class="text-xs text-doomu-text-muted uppercase font-mono">Séance sélectionnée</span>
          <h4 class="font-semibold text-base text-doomu-text">{{ seanceModal.title }}</h4>
          <p class="text-small text-on-surface-variant flex items-center gap-2">
            <span class="px-1.5 py-0.5 bg-primary/10 text-primary text-xs rounded font-medium">{{ seanceModal.classe }}</span>
            • {{ formatDate(seanceModal.created_at) }}
          </p>
        </div>

        <div class="space-y-3">
          <div class="flex justify-between items-center border-b border-outline-variant/20 pb-2">
            <span class="font-medium text-small text-doomu-text">Élèves présents</span>
            <span class="px-2.5 py-0.5 bg-secondary/10 text-secondary text-xs rounded-full font-bold">
              {{ currentSeanceParticipants.length }} inscrit(s)
            </span>
          </div>

          <!-- Liste des enfants trouvés -->
          <div v-if="currentSeanceParticipants.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pr-1">
            <div 
              v-for="child in currentSeanceParticipants" 
              :key="child.id"
              class="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl border border-outline-variant/10 hover:border-outline-variant/40 transition-all"
            >
              <div class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase">
                {{ child.name.substring(0, 2) }}
              </div>
              <div class="flex flex-col">
                <span class="font-body text-small text-doomu-text font-medium">{{ child.name }}</span>
                <span v-if="child.nivScolaire" class="text-[11px] text-doomu-text-muted">{{ child.nivScolaire }}</span>
              </div>
            </div>
          </div>

          <!-- Si aucun enfant n'a été coché présent -->
          <div v-else class="text-center py-8 text-doomu-text-muted">
            <Icon name="face" class="text-[40px] text-outline mb-2 mx-auto" />
            <p class="font-body text-small italic">Aucun enfant n'a été émargé présent pour cette séance.</p>
          </div>
        </div>
      </div>
      <template #footer>
        <button class="px-4 py-2 bg-doomu-bg hover:bg-doomu-border rounded-lg text-doomu-text transition-colors ml-auto" @click="showParticipantsModal = false">Fermer</button>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { classes } from '~/stores/child'
import { useSeance } from '~/composables/useSeance'
import { useParticipantSeance } from '~/composables/useParticipant'
import { useToast } from '~/composables/useToast'
import type { ClasseType } from '~/types/classe'
import type { Month } from '~/types/index'
import type { Seance } from '~/types/seance'

definePageMeta({
  layout: 'dashboard'
})

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

// Cycle de vie : Charger les données
onMounted(async () => {
  await fetchAllSeances()
  await fetchAllSeanceData()
})

// --- 👥 LOGIQUE FILTRE PARTICIPANTS ---
// Récupère dynamiquement la liste des enfants de la séance ouverte dans la modale
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