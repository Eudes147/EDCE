<template>
  <div class="min-h-screen p-6 overflow-auto">
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="font-h1 text-on-surface mb-2 text-2xl font-bold">Activity Management</h1>
        <p class="font-body text-on-surface-variant">Créez et gérez ici toutes les activités effectuées lors des événements</p>
      </div>
    </div>

    <div class="mb-6 flex gap-4">
      <button 
        @click="openCreateModal" 
        class="px-6 py-2 bg-primary text-white rounded-lg font-body text-body hover:shadow-md transition-all flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Ajouter Activité
      </button>
    </div>

    <div class="overflow-x-auto bg-white rounded-xl shadow-sm border border-outline-variant/20">
      <table class="w-full text-left border-collapse">
        <thead class="bg-surface-container-low border-b border-outline-variant/30">
          <tr>
            <th class="px-6 py-4 font-caption text-caption text-outline uppercase tracking-wider w-24">ID</th>
            <th class="px-6 py-4 font-caption text-caption text-outline uppercase tracking-wider">Titre de l'activité</th>
            <th class="px-6 py-4 font-caption text-caption text-outline uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-outline-variant/20">
          <tr 
            v-for="(activity, index) in paginatedActivities" 
            :key="activity.id" 
            class="hover:bg-surface-container-low transition-colors group"
          >
            <td class="px-6 py-4">
              <div class="w-8 h-8 rounded-full flex justify-center items-center bg-primary/10 text-primary text-sm font-bold">
                {{ globalIndex(index) }}
              </div>
            </td>
            <td class="px-6 py-4 text-body font-medium text-doomu-text">{{ activity.title }}</td>
            <td class="px-6 py-4 text-right space-x-2">
              <button 
                @click="openViewModal(activity)" 
                class="p-2 text-outline hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" 
                title="Voir"
              >
                <Icon name="visibility" class="text-[20px]" />
              </button>
              
              <button 
                @click="openEditModal(activity)" 
                class="p-2 text-outline hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" 
                title="Modifier"
              >
                <Icon name="edit" class="text-[20px]" />
              </button>
              
              <button 
                @click="openDeleteModal(activity)" 
                class="p-2 text-outline hover:text-error hover:bg-error/10 rounded-lg transition-colors" 
                title="Supprimer"
              >
                <Icon name="delete" class="text-[20px]" />
              </button>
            </td>
          </tr>
          
          <tr v-if="listActivities.length === 0 && !isLoading">
            <td colspan="3" class="px-6 py-8 text-center text-doomu-text-muted font-body">
              Aucune activité enregistrée pour le moment.
            </td>
          </tr>
        </tbody>
      </table>

      <div 
        v-if="totalPages > 1" 
        class="p-4 bg-surface-container-low border-t border-outline-variant/30 flex items-center justify-between gap-4 select-none"
      >
        <p class="font-body text-xs text-on-surface-variant">
          Affichage de <span class="font-semibold text-doomu-text">{{ startRow }}</span> à 
          <span class="font-semibold text-doomu-text">{{ endRow }}</span> sur 
          <span class="font-semibold text-primary">{{ listActivities.length }}</span> activités
        </p>

        <div class="flex items-center gap-2">
          <button 
            @click="prevPage" 
            :disabled="currentPage === 1"
            class="p-2 border border-outline-variant/40 rounded-lg text-outline hover:bg-primary/5 hover:text-primary disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-outline transition-all"
          >
            <Icon name="chevron_left" class="text-[20px]" />
          </button>

          <button 
            v-for="page in totalPages" 
            :key="page"
            @click="currentPage = page"
            :class="[
              'w-8 h-8 rounded-lg font-body text-xs font-semibold transition-all',
              currentPage === page 
                ? 'bg-primary text-white shadow-sm' 
                : 'border border-outline-variant/20 text-doomu-text hover:bg-primary/5 hover:text-primary'
            ]"
          >
            {{ page }}
          </button>

          <button 
            @click="nextPage" 
            :disabled="currentPage === totalPages"
            class="p-2 border border-outline-variant/40 rounded-lg text-outline hover:bg-primary/5 hover:text-primary disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-outline transition-all"
          >
            <Icon name="chevron_right" class="text-[20px]" />
          </button>
        </div>
      </div>
    </div>

    <Modal v-model="showViewModal" title="Détails de l'activité" size="md">
      <div v-if="selectedActivity" class="space-y-4">
        <div class="grid grid-cols-1 gap-4">
          <div>
            <p class="text-sm text-doomu-text-muted">ID Unique</p>
            <p class="font-medium text-doomu-text bg-doomu-bg/30 p-2 rounded border border-doomu-border text-xs font-mono select-all">
              {{ selectedActivity.id }}
            </p>
          </div>
          <div>
            <p class="text-sm text-doomu-text-muted">Titre de l'activité</p>
            <p class="font-medium text-doomu-text text-lg">{{ selectedActivity.title }}</p>
          </div>
        </div>
      </div>
      <template #footer>
        <button class="px-4 py-2 bg-doomu-bg hover:bg-doomu-border rounded-lg text-doomu-text transition-colors" @click="showViewModal = false">
          Fermer
        </button>
      </template>
    </Modal>

    <Modal v-model="showFormModal" :title="isEditMode ? 'Modifier l\'activité' : 'Ajouter une nouvelle activité'" size="md">
      <form @submit.prevent="submitForm" id="activityForm" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-doomu-text mb-1">Titre de l'activité <span class="text-error">*</span></label>
          <input 
            v-model="form.title" 
            type="text" 
            required
            placeholder="Ex: Cours de poterie, Sortie Cinéma..."
            class="w-full px-4 py-2 border border-outline-variant/50 rounded-lg focus:outline-none focus:border-primary transition-colors text-doomu-text"
          />
        </div>
      </form>
      <template #footer>
        <button type="button" class="px-4 py-2 border border-doomu-border rounded-lg text-doomu-text hover:bg-doomu-bg transition-colors" @click="showFormModal = false">
          Annuler
        </button>
        <button type="submit" form="activityForm" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors" :disabled="isLoading">
          {{ isEditMode ? 'Sauvegarder les modifications' : 'Créer l\'activité' }}
        </button>
      </template>
    </Modal>

    <Modal v-model="showDeleteModal" title="Confirmation de suppression" size="sm">
      <div v-if="selectedActivity" class="space-y-3 text-center py-2">
        <div class="w-12 h-12 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-2">
          <Icon name="delete" class="text-[24px]" />
        </div>
        <p class="text-body text-doomu-text font-medium">Êtes-vous sûr de vouloir supprimer cette activité ?</p>
        <p class="text-sm text-error font-semibold bg-error/5 p-2 rounded border border-error/20">
          "{{ selectedActivity.title }}"
        </p>
        <p class="text-xs text-doomu-text-muted">Cette action est irréversible et supprimera toutes les planifications liées.</p>
      </div>
      <template #footer>
        <button class="px-4 py-2 border border-doomu-border rounded-lg text-doomu-text hover:bg-doomu-bg transition-colors w-full" @click="showDeleteModal = false">
          Annuler
        </button>
        <button class="px-4 py-2 bg-error text-white rounded-lg hover:bg-error-dark transition-colors w-full" @click="confirmDelete" :disabled="isLoading">
          Supprimer définitivement
        </button>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import type { Activity } from '~/types/activity'
import { useActivities } from '~/composables/useActivity'
import { useToast } from '~/composables/useToast'

definePageMeta({
  layout: 'dashboard'
})

const { 
  listActivities, 
  fetchAllData, 
  createActivity, 
  updateActivity, 
  deleteActivity, 
  isLoading 
} = useActivities()

const toast = useToast()

// États des Modales
const showViewModal = ref(false)
const showFormModal = ref(false)
const showDeleteModal = ref(false)
const isEditMode = ref(false)

const selectedActivity = ref<Activity | null>(null)

const form = reactive({
  id: '',
  title: ''
})

// 🔢 ÉTATS DE LA PAGINATION
const currentPage = ref(1)
const itemsPerPage = 10

onMounted(async () => {
  await fetchAllData()
})

// Réinitialiser la page à 1 si le catalogue global d'activités change (ex: suite à une suppression ou un chargement)
watch(() => listActivities.value.length, () => {
  if (currentPage.value > totalPages.value && totalPages.value > 0) {
    currentPage.value = totalPages.value
  }
})

// --- LOGIQUE DE PAGINATION (COMPUTED) ---
const totalPages = computed(() => Math.ceil(listActivities.value.length / itemsPerPage))

const paginatedActivities = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return listActivities.value.slice(start, end)
})

// Éléments de statistiques d'affichage de la ligne basse
const startRow = computed(() => listActivities.value.length === 0 ? 0 : (currentPage.value - 1) * itemsPerPage + 1)
const endRow = computed(() => {
  const currentEnd = currentPage.value * itemsPerPage
  return currentEnd > listActivities.value.length ? listActivities.value.length : currentEnd
})

// Fonctions de Navigation
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

// Calcul continu pour le badge de la première colonne (ID)
const globalIndex = (localIndex: number) => {
  return (currentPage.value - 1) * itemsPerPage + localIndex + 1
}

// --- ACTIONS MODALES ---
const openViewModal = (activity: Activity) => {
  selectedActivity.value = activity
  showViewModal.value = true
}

const openCreateModal = () => {
  isEditMode.value = false
  selectedActivity.value = null
  form.id = ''
  form.title = ''
  showFormModal.value = true
}

const openEditModal = (activity: Activity) => {
  isEditMode.value = true
  selectedActivity.value = activity
  form.id = activity.id
  form.title = activity.title
  showFormModal.value = true
}

const openDeleteModal = (activity: Activity) => {
  selectedActivity.value = activity
  showDeleteModal.value = true
}

// --- SOUMISSION FORMULAIRE ---
const submitForm = async () => {
  if (!form.title.trim()) {
    toast.warning('Champs requis', "Veuillez renseigner le titre de l'activité.")
    return
  }

  try {
    if (isEditMode.value) {
      await updateActivity(form.id, form.title)
      toast.success('Activité mise à jour', `L'activité "${form.title}" a été modifiée avec succès.`)
    } else {
      await createActivity(form.title)
      toast.success('Activité créée', `L'activité "${form.title}" a bien été ajoutée au catalogue.`)
      currentPage.value = totalPages.value // Se déplacer automatiquement sur la dernière page pour voir le nouvel élément
    }
    showFormModal.value = false
  } catch (err) {
    toast.error('Erreur opération', "Impossible d'enregistrer l'activité. Veuillez réessayer.")
  }
}

// --- SUPPRESSION CONFIRMÉE ---
const confirmDelete = async () => {
  if (!selectedActivity.value) return

  const targetedTitle = selectedActivity.value.title
  try {
    await deleteActivity(selectedActivity.value.id)
    toast.success('Activité supprimée', `L'activité "${targetedTitle}" a été retirée avec succès.`)
    showDeleteModal.value = false
    selectedActivity.value = null
  } catch (err) {
    toast.error('Échec de la suppression', 'Une erreur est survenue lors de la suppression sur le serveur.')
  }
}
</script>