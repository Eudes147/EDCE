<template>
  <div class="min-h-screen p-6 overflow-auto">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="font-h1 text-on-surface mb-2">Activity Management</h1>
      <p class="font-body text-on-surface-variant">Créez ici  toutes les activités effectuées lors des événements</p>
    </div>

    <!-- Filters Section -->
    <div class="mb-6 flex gap-4">
      <button class="px-6 py-2 bg-primary text-white rounded-lg font-body text-body hover:shadow-md transition-all">
        <span class="flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Ajouter Activité
        </span>
      </button>
    </div>

    <!-- Activities List -->
    <table class="w-full text-left border-collapse">
      <thead>
        <tr class="bg-surface-container-low/50">
          <th class="px-6 py-4 font-caption text-caption text-outline uppercase">ID</th>
          <th class="px-6 py-4 font-caption text-caption text-outline uppercase tracking-wider">Titre de l'activité.</th>
        </tr>
      </thead>
      <tbody>
        <tr class="hover:bg-surface-container-low transition-colors group" v-for="(activity, index) in listActivities">
          <td class="px-6 py-4">
            <div class="w-8 h-8  rounded-full flex justify-center items-center bg-primary text-white text-h2 font-h2">{{ index+1 }}</div>
          </td>
          <td>{{ activity.title }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Activity Details Modal -->
    <transition name="fade">
      <div v-if="isModalOpen" class="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Activity } from '~/types/activity'
import { useActivities } from '~/composables/useActivity'

// Page layout
definePageMeta({
  layout: 'dashboard'
})

// Composables
const {createActivity, listActivities}=useActivities()
// State
const filterEvent = ref('')
const filterType = ref('')
const isModalOpen = ref(false)
const selectedActivity = ref<Activity | null>(null)

// Methods
const openActivityModal = (activity: Activity) => {
  selectedActivity.value = activity
  isModalOpen.value = true
  document.body.classList.add('modal-open')
}

const closeActivityModal = () => {
  isModalOpen.value = false
  document.body.classList.remove('modal-open')
  setTimeout(() => {
    selectedActivity.value = null
  }, 200)
}

const handleMore = (activity: Activity) => {
  console.log('More options for activity:', activity.id)
}

// Keyboard escape handler
onMounted(() => {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isModalOpen.value) {
      closeActivityModal()
    }
  })
})

onUnmounted(() => {
  window.removeEventListener('keydown', () => {})
  document.body.classList.remove('modal-open')
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 200ms ease-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e1ed;
  border-radius: 10px;
}
</style>