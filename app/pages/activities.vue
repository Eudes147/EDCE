<template>
  <div class="min-h-screen p-6 overflow-auto">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="font-h1 text-on-surface mb-2">Activity Management</h1>
      <p class="font-body text-on-surface-variant">Gérez toutes les activités des événements</p>
    </div>

    <!-- Filters Section -->
    <div class="mb-6 flex gap-4">
      <select v-model="filterEvent" class="px-4 py-2 bg-surface-container border border-outline-variant/30 rounded-lg font-body text-body text-on-surface">
        <option value="">Tous les événements</option>
        <option value="ARBRE DE NOËL">Arbre de Noël</option>
        <option value="SOIREE RECREATIVE">Soirée Récréative</option>
      </select>

      <select v-model="filterType" class="px-4 py-2 bg-surface-container border border-outline-variant/30 rounded-lg font-body text-body text-on-surface">
        <option value="">Tous les types</option>
        <option value="INTERPRETATION">Interprétation</option>
        <option value="CHORALE">Chorale</option>
        <option value="BALLET">Ballet</option>
        <option value="CHORE">Chorégraphie</option>
        <option value="SKETCH">Sketch</option>
        <option value="LESSON">Leçon</option>
      </select>

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
    <div class="space-y-4">
      <div
        v-for="activity in filteredActivities"
        :key="activity.id"
        class="bg-surface border border-outline-variant/30 rounded-lg p-4 hover:shadow-soft transition-all cursor-pointer"
        @click="openActivityModal(activity)"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <span class="font-h3 font-semibold text-on-surface">{{ formatActivityType(activity.type) }}</span>
              <span class="px-3 py-1 bg-primary-container/10 text-primary rounded-full font-caption text-[10px]">{{ activity.event }}</span>
              <span class="px-3 py-1 bg-secondary-container/20 text-secondary rounded-full font-caption text-[10px]">{{ activity.year }}</span>
            </div>
            <div class="flex items-center gap-4 mt-3">
              <div class="flex items-center gap-2 text-on-surface-variant">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span class="font-small">{{ activity.participantCount }} participants</span>
              </div>
              <div class="flex items-center gap-2 text-on-surface-variant">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="font-small">{{ activity.supervisorCount }} superviseurs</span>
              </div>
            </div>
          </div>
          <button
            class="p-2 hover:bg-surface-container-high rounded-full transition-colors text-on-surface-variant"
            @click.stop="handleMore(activity)"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Activity Details Modal -->
    <transition name="fade">
      <div v-if="isModalOpen" class="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
        <div
          class="bg-surface rounded-xl shadow-lg max-h-[90vh] overflow-hidden flex flex-col w-full max-w-2xl"
          @click.stop
        >
          <!-- Modal Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-outline-variant/20 bg-surface-container-low/50">
            <div>
              <h2 class="font-h2 font-semibold text-on-surface">{{ formatActivityType(selectedActivity!.type) }}</h2>
              <p class="font-caption text-on-surface-variant mt-1">{{ selectedActivity!.event }} - {{ selectedActivity!.year }}</p>
            </div>
            <button
              class="p-2 hover:bg-surface-container-high rounded-full transition-colors"
              @click="closeActivityModal"
            >
              <svg class="w-6 h-6 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <!-- Participants Column -->
              <div class="space-y-4">
                <div class="flex items-center justify-between mb-2">
                  <h4 class="font-body font-semibold text-on-surface flex items-center gap-2">
                    <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Participants ({{ selectedActivity!.participantCount }})
                  </h4>
                  <button class="text-primary font-small font-medium hover:underline flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Ajouter
                  </button>
                </div>

                <div class="space-y-2">
                  <div
                    v-for="(participant, idx) in selectedActivity!.participants.slice(0, 3)"
                    :key="participant.id"
                    class="bg-surface-container-low p-3 rounded-lg flex items-center justify-between group"
                  >
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-primary-container/20 text-primary flex items-center justify-center font-bold text-xs">
                        {{ participant.avatar }}
                      </div>
                      <div>
                        <p class="font-body text-small font-medium">{{ participant.name }}</p>
                        <p class="font-caption text-on-surface-variant">Classe: {{ participant.classe }}</p>
                      </div>
                    </div>
                    <button class="opacity-0 group-hover:opacity-100 p-1.5 text-error hover:bg-error/10 rounded transition-all">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l-2-2m0 0l-2-2m2 2l2-2m-2 2l-2 2" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div v-if="selectedActivity!.participants.length > 3" class="text-center py-2">
                  <button class="text-on-surface-variant font-caption hover:text-primary transition-colors underline decoration-outline-variant">
                    Voir tous les {{ selectedActivity!.participants.length }} participants
                  </button>
                </div>
              </div>

              <!-- Supervisors Column -->
              <div class="space-y-4">
                <div class="flex items-center justify-between mb-2">
                  <h4 class="font-body font-semibold text-on-surface flex items-center gap-2">
                    <svg class="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                    Superviseurs ({{ selectedActivity!.supervisorCount }})
                  </h4>
                  <button class="text-primary font-small font-medium hover:underline flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Assigner
                  </button>
                </div>

                <div class="space-y-2">
                  <div
                    v-for="supervisor in selectedActivity!.supervisors"
                    :key="supervisor.id"
                    class="border border-outline-variant/30 p-3 rounded-lg flex items-center justify-between"
                  >
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-secondary-container/20 text-secondary flex items-center justify-center font-bold text-xs">
                        {{ supervisor.initials }}
                      </div>
                      <div>
                        <p class="font-body text-small font-medium">{{ supervisor.name }}</p>
                        <p class="font-caption text-secondary">{{ supervisor.role }}</p>
                      </div>
                    </div>
                    <button class="p-1.5 text-on-surface-variant hover:bg-surface-container-high rounded transition-all">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Quick Stats Card -->
                <div class="mt-8 bg-surface-container p-4 rounded-xl">
                  <h5 class="font-caption text-on-surface-variant uppercase mb-3">Récapitulatif</h5>
                  <div class="flex justify-between items-center mb-2">
                    <span class="font-small">Répétitions prévues</span>
                    <span class="font-small font-bold">{{ selectedActivity!.rehearsals }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="font-small">Statut préparation</span>
                    <span class="px-2 py-0.5 rounded text-[10px] bg-secondary-container text-on-secondary-container font-bold">{{ selectedActivity!.preparationStatus }}%</span>
                  </div>
                  <div class="mt-3 h-1 w-full bg-outline-variant/20 rounded-full overflow-hidden">
                    <div class="h-full bg-secondary transition-all" :style="{ width: `${selectedActivity!.preparationStatus}%` }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="px-6 py-4 border-t border-outline-variant/20 bg-surface-container-low/50 flex justify-end gap-3 sticky bottom-0">
            <button
              class="px-6 py-2 rounded-lg font-body text-body text-on-surface-variant hover:bg-surface-container-high transition-colors"
              @click="closeActivityModal"
            >
              Fermer
            </button>
            <button class="px-6 py-2 rounded-lg font-body text-body bg-primary text-white shadow-sm hover:shadow-md transition-all">
              Enregistrer les modifications
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { activitiesData, formatActivityType, type Activity } from '~/data/activitiesData'

// Page layout
definePageMeta({
  layout: 'dashboard'
})

// State
const filterEvent = ref('')
const filterType = ref('')
const isModalOpen = ref(false)
const selectedActivity = ref<Activity | null>(null)

// Computed properties
const filteredActivities = computed(() => {
  return activitiesData.filter(activity => {
    const matchEvent = !filterEvent.value || activity.event === filterEvent.value
    const matchType = !filterType.value || activity.type === filterType.value
    return matchEvent && matchType
  })
})

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