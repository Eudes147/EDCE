<template>
  <div v-if="isLoading">
    <Loader name="des activités" />
  </div>
  <div v-else-if="listActivities" class="p-4 md:p-6 max-w-[1400px] mx-auto space-y-6 md:space-y-8">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="font-h1 text-xl md:text-h1 font-bold text-on-surface mb-1">Activity Management</h1>
        <p class="font-body text-xs md:text-sm text-on-surface-variant">Créez et gérez ici toutes les activités effectuées lors des événements.</p>
      </div>
    </div>

    <div class="flex gap-4">
      <button v-if="authStore.isAdmin || permissionsLocal.canEditChild"
        @click="openCreateModal" 
        class="px-5 py-2.5 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition-all flex items-center gap-2 text-sm shadow-sm active:scale-95"
      >
        <Icon name="add" color="text-white" />
        Ajouter une activité
      </button>
    </div>

    <div class="overflow-x-auto bg-white rounded-xl border border-outline-variant shadow-sm">
      <table class="w-full text-left border-collapse">
        <thead class="bg-surface-container-low/50 border-b border-outline-variant/40">
          <tr>
            <th class="px-3 py-2 md:px-6 md:py-4 text-xs font-semibold md:font-bold uppercase md:tracking-wider text-on-surface-variant/80 w-12 md:w-24">ID</th>
            <th class="px-3 py-2 md:px-6 md:py-4 text-xs font-semibold md:font-bold uppercase md:tracking-wider text-on-surface-variant/80">Titre de l'activité</th>
            <th class="px-3 py-2 md:px-6 md:py-4 text-xs font-bold uppercase md:tracking-wider text-on-surface-variant/80 text-right w-44">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-outline-variant/30">
          <tr 
            v-for="(activity, index) in paginatedActivities" 
            :key="activity.id" 
            class="hover:bg-surface-container-low/40 transition-colors group"
          >
            <td class="px-1 py-2 md:px-6 md:py-4">
              <div class="w-4 h-4 md:w-8 md:h-8 rounded-full flex justify-center items-center bg-primary/10 text-primary text-xs font-semibold md:font-bold">
                {{ globalIndex(index) }}
              </div>
            </td>
            <td class="px-1 py-2 md:px-6 md:py-4 text-sm font-normal md:font-semibold text-on-surface">{{ activity.title }}</td>
            <td class="px-1 py-2 md:px-6 md:py-4 text-right">
              <div class="flex items-center justify-end gap-1">
                <button 
                  @click="openViewModal(activity)" 
                  class="p-0.5 md:p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-md transition-colors" 
                  title="Voir"
                >
                  <Icon name="visibility" color="text-on-surface-variant hover:text-primary"  />
                </button>
                
                <button v-if="authStore.isAdmin || permissionsLocal.canEditChild"
                  @click="openEditModal(activity)" 
                  class="p-0.5 md:p-1.5 text-on-surface-variant hover:text-secondary hover:bg-secondary/5 rounded-md transition-colors" 
                  title="Modifier"
                >
                  <Icon name="edit" color="text-on-surface-variant hover:text-secondary" />
                </button>
                
                <button v-if="authStore.isAdmin"
                  @click="openDeleteModal(activity)" 
                  class="p-0.5 md:p-1.5 text-on-surface-variant hover:text-error hover:bg-error/5 rounded-md transition-colors" 
                  title="Supprimer"
                >
                  <Icon name="delete" color="text-on-surface-variant hover:text-error" />
                </button>
              </div>
            </td>
          </tr>
          
          <tr v-if="listActivities.length === 0 && !isLoading">
            <td colspan="3" class="px-6 py-8 text-center text-on-surface-variant italic text-sm">
              Aucune activité enregistrée pour le moment.
            </td>
          </tr>
        </tbody>
      </table>

      <div 
        v-if="totalPages > 1" 
        class="p-4 bg-white border-t border-outline-variant/40 flex items-center justify-between gap-4 select-none"
      >
        <p class="text-xs text-on-surface-variant font-medium">
          Affichage de <span class="font-bold text-on-surface">{{ startRow }}</span> à 
          <span class="font-bold text-on-surface">{{ endRow }}</span> sur 
          <span class="font-bold text-primary">{{ listActivities.length }}</span> activités
        </p>

        <div class="flex items-center gap-1.5">
          <button 
            @click="prevPage" 
            :disabled="currentPage === 1"
            class="p-2 border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Icon name="chevron_left" color="text-on-surface-variant" />
          </button>

          <button 
            v-for="page in totalPages" 
            :key="page"
            @click="currentPage = page"
            :class="[
              'w-8 h-8 rounded-lg text-xs font-semibold transition-all',
              currentPage === page 
                ? 'bg-primary text-white shadow-sm' 
                : 'border border-outline-variant text-on-surface hover:bg-surface-container'
            ]"
          >
            {{ page }}
          </button>

          <button 
            @click="nextPage" 
            :disabled="currentPage === totalPages"
            class="p-2 border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Icon name="chevron_right" color="text-on-surface-variant" />
          </button>
        </div>
      </div>
    </div>

    <Modal v-model="showViewModal" title="Détails de l'activité" size="md">
      <div v-if="selectedActivity" class="space-y-4 py-1">
        <div class="grid grid-cols-1 gap-4">
          <div>
            <p class="text-xs text-on-surface-variant font-bold uppercase tracking-wide">ID Unique</p>
            <p class="font-mono text-xs text-on-surface bg-surface-container p-2.5 rounded-lg border border-outline-variant mt-1.5 select-all">
              {{ selectedActivity.id }}
            </p>
          </div>
          <div>
            <p class="text-xs text-on-surface-variant font-bold uppercase tracking-wide">Titre de l'activité</p>
            <p class="font-bold text-on-surface text-lg mt-1">{{ selectedActivity.title }}</p>
          </div>
        </div>
      </div>
      <template #footer>
        <button class="px-4 py-2 bg-surface-container border border-outline-variant rounded-lg text-on-surface hover:bg-surface-container-high transition-colors text-sm font-semibold w-full" @click="showViewModal = false">
          Fermer
        </button>
      </template>
    </Modal>

    <Modal v-model="showFormModal" :title="isEditMode ? 'Modifier l\'activité' : 'Ajouter une nouvelle activité'" size="md">
      <div class="py-1">
        <form @submit.prevent="submitForm" id="activityForm" class="space-y-4">
          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-on-surface-variant uppercase tracking-wide">Titre de l'activité <span class="text-error">*</span></label>
            <input 
              v-model="form.title" 
              type="text" 
              required
              placeholder="Ex: Cours de poterie, Sortie Cinéma..."
              class="w-full px-4 py-2.5 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-on-surface text-sm font-medium focus:outline-none"
            />
          </div>
        </form>
      </div>
      <template #footer>
        <div class="flex flex-col sm:flex-row gap-2 w-full justify-end">
          <button type="button" class="px-4 py-2 border border-outline-variant rounded-lg text-on-surface hover:bg-surface-container transition-colors text-sm font-medium order-2 sm:order-1" @click="showFormModal = false">
            Annuler
          </button>
          <button type="submit" form="activityForm" class="px-5 py-2 bg-primary text-white rounded-lg font-semibold shadow-sm text-sm hover:opacity-90 transition-opacity order-1 sm:order-2" :disabled="isLoading">
            {{ isEditMode ? 'Sauvegarder' : 'Créer l\'activité' }}
          </button>
        </div>
      </template>
    </Modal>

    <Modal v-model="showDeleteModal" title="Confirmation de suppression" size="sm">
      <div v-if="selectedActivity" class="space-y-4 text-center py-2">
        <div class="w-12 h-12 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto">
          <Icon name="delete" color="text-error" />
        </div>
        <div class="space-y-1 px-2">
          <p class="text-sm font-medium text-on-surface">Êtes-vous sûr de vouloir supprimer cette activité ?</p>
          <p class="text-xs text-on-surface-variant italic">Cette action est irréversible et détruira toutes les planifications liées.</p>
        </div>
        <div class="text-sm font-bold text-error bg-error/5 p-3 rounded-xl border border-error/10">
          "{{ selectedActivity.title }}"
        </div>
      </div>
      <template #footer>
        <div class="flex gap-2 w-full">
          <button class="px-4 py-2 border border-outline-variant rounded-lg text-on-surface w-full hover:bg-surface-container transition-colors text-sm font-medium" @click="showDeleteModal = false">
            Annuler
          </button>
          <button class="px-4 py-2 bg-error text-white rounded-lg w-full hover:bg-error/90 transition-opacity text-sm font-semibold" @click="confirmDelete" :disabled="isLoading">
            Supprimer
          </button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import type { Activity } from '~/types/activity'
import { useActivities } from '~/composables/useActivity'
import { useToast } from '~/composables/useToast'
import { useAuthStore } from '../stores/auth'

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
const authStore=useAuthStore()

// États des Modales
const showViewModal = ref(false)
const showFormModal = ref(false)
const showDeleteModal = ref(false)
const isEditMode = ref(false)
const permissionsLocal=ref()

const selectedActivity = ref<Activity | null>(null)

const form = reactive({
  id: '',
  title: ''
})

// 🔢 ÉTATS DE LA PAGINATION
const currentPage = ref(1)
const itemsPerPage = 10

const permissions=authStore.permissions
if(authStore.userStatus && permissions){
  permissionsLocal.value=permissions[authStore.userStatus]
} 
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
    } else {
      await createActivity(form.title)
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