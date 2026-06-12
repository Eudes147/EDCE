<template>
  <!-- Conteneur adaptatif : p-3 sur mobile évoluant vers p-8 sur desktop pour un meilleur confort de lecture -->
  <div class="p-3 sm:p-4 md:p-8 max-w-[1400px] mx-auto space-y-4 sm:space-y-6 md:space-y-8">
    
    <!-- 📋 EN-TÊTE RESPONSIVE (S'empile proprement sur smartphone) -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-outline-variant/30 pb-4">
      <div>
        <h2 class="font-h1 text-lg sm:text-xl md:text-2xl font-bold text-on-surface">Planning des Enseignants</h2>
        <p class="font-body text-[11px] sm:text-xs md:text-sm text-on-surface-variant mt-0.5">Consultez vos affectations officielles pour le mois en cours.</p>
      </div>
      <div v-if="currentSchedule?.monthKey" class="bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 self-stretch sm:self-auto justify-center">
        <Icon name="calendar_month" size="1.15rem" />
        <span>Période : {{ formatMonthKey(currentSchedule.monthKey) }}</span>
      </div>
    </div>

    <!-- ÉTAT DE CHARGEMENT RÉSEAU -->
    <div v-if="isLoadingSchedule" class="p-8 sm:p-12 text-center bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm">
      <div class="animate-spin inline-block w-5 h-5 border-[2px] border-primary border-t-transparent rounded-full mb-2"></div>
      <p class="text-xs sm:text-sm text-on-surface-variant">Récupération du calendrier en cours...</p>
    </div>

    <!-- ÉTAT DE PLANNING NON PUBLIÉ -->
    <div v-else-if="scheduleRows.length === 0" class="text-center py-12 sm:py-16 bg-surface-container-lowest border border-dashed border-outline-variant rounded-xl shadow-sm space-y-3">
      <Icon name="event_busy" class="text-3xl sm:text-4xl text-outline mx-auto" />
      <h3 class="text-sm sm:text-base font-bold text-on-surface">Aucun planning publié</h3>
      <p class="text-xs sm:text-sm text-on-surface-variant max-w-xs sm:max-w-md mx-auto">L'emploi du temps de ce mois n'a pas encore été validé par l'équipe administrative.</p>
    </div>

    <!-- AFFICHAGE DU PLANNING DE SERVICE -->
    <section v-else class="space-y-4 animate-fade-in">
      
      <!-- 🖥️ VERSION DESKTOP : Grille unifiée (Visible à partir de l'écran md) -->
      <div class="hidden md:grid grid-cols-4 gap-1 bg-outline-variant/30 border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        
        <div class="bg-surface-container-high p-4 font-bold text-on-surface text-center text-sm">Dates (Dimanches)</div>
        <div class="bg-surface-container-high p-4 font-bold text-primary text-center text-sm">NORMAL</div>
        <div class="bg-surface-container-high p-4 font-bold text-secondary text-center text-sm">SUNDAY_SCHOOL</div>
        <div class="bg-surface-container-high p-4 font-bold text-tertiary text-center text-sm">DLT</div>

        <template v-for="row in scheduleRows" :key="row.dateLabel">
          
          <div class="bg-surface-container-low p-4 flex items-center justify-center font-bold text-on-surface text-sm border-r border-outline-variant/30 text-center">
            {{ row.dateLabel }}
          </div>

          <div 
            v-for="slotType in (['NORMAL', 'SUNDAY_SCHOOL', 'DLT'] as const)" 
            :key="slotType" 
            class="p-4 bg-white min-h-[90px] flex flex-col justify-center gap-2 border-r border-b border-outline-variant/20 last:border-r-0"
          >
            <span 
              v-for="teacherId in row.assignments[slotType]" 
              :key="teacherId"
              :class="[
                'text-xs px-3 py-1.5 rounded-lg text-center font-semibold block truncate transition-transform hover:scale-[1.02]',
                slotType === 'NORMAL' ? 'bg-primary/10 text-primary border border-primary/10' : 
                slotType === 'SUNDAY_SCHOOL' ? 'bg-secondary/10 text-secondary border border-secondary/10' : 
                'bg-tertiary/10 text-tertiary border border-tertiary/10'
              ]"
              :title="getTeacherFullName(teacherId)"
            >
              {{ getTeacherFullName(teacherId) }}
            </span>

            <span v-if="row.assignments[slotType].length === 0" class="text-xs text-outline/50 italic text-center block py-1">
              Aucun enseignant
            </span>
          </div>
        </template>
      </div>

      <!-- 📱 VERSION MOBILE/TABLETTE : Timeline de fiches Sunday (Masquée sur PC) -->
      <div class="block md:hidden space-y-4">
        <div 
          v-for="row in scheduleRows" 
          :key="`mobile-${row.dateLabel}`" 
          class="bg-white border border-outline-variant/60 rounded-xl p-3.5 shadow-sm space-y-3.5"
        >
          <!-- En-tête du dimanche concerné -->
          <div class="flex items-center gap-2 border-b border-outline-variant/30 pb-2.5">
            <Icon name="calendar_today" class="text-primary shrink-0" size="1.1rem" />
            <h4 class="font-bold text-xs sm:text-sm text-on-surface">{{ row.dateLabel }}</h4>
          </div>

          <!-- Alignement vertical ordonné des trois créneaux horaires de service -->
          <div class="space-y-3.5 pt-1">
            <div 
              v-for="slotType in (['NORMAL', 'SUNDAY_SCHOOL', 'DLT'] as const)" 
              :key="`mobile-slot-${slotType}`"
              class="flex flex-col gap-1.5"
            >
              <!-- Étiquette dynamique du type de culte -->
              <div class="flex items-center gap-1.5">
                <span :class="[
                  'w-1.5 h-1.5 rounded-full shrink-0',
                  slotType === 'NORMAL' ? 'bg-primary' : slotType === 'SUNDAY_SCHOOL' ? 'bg-secondary' : 'bg-tertiary'
                ]"></span>
                <span :class="[
                  'text-[9px] font-bold uppercase tracking-wider',
                  slotType === 'NORMAL' ? 'text-primary' : slotType === 'SUNDAY_SCHOOL' ? 'text-secondary' : 'text-tertiary'
                ]">
                  {{ slotType }}
                </span>
              </div>

              <!-- Cartes des enseignants affectés -->
              <div class="pl-3 flex flex-wrap gap-1.5">
                <div 
                  v-for="teacherId in row.assignments[slotType]" 
                  :key="`mobile-teacher-${teacherId}`"
                  :class="[
                    'inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border',
                    slotType === 'NORMAL' ? 'bg-primary/5 text-primary border-primary/10' : 
                    slotType === 'SUNDAY_SCHOOL' ? 'bg-secondary/5 text-secondary border-secondary/10' : 
                    'bg-tertiary/5 text-tertiary border-tertiary/10'
                  ]"
                >
                  <div :class="[
                    'w-4 h-4 rounded-full flex items-center justify-center font-bold text-[8px] uppercase shrink-0',
                    slotType === 'NORMAL' ? 'bg-primary/10' : slotType === 'SUNDAY_SCHOOL' ? 'bg-secondary/10' : 'bg-tertiary/10'
                  ]">
                    {{ getTeacherFullName(teacherId).charAt(0) }}
                  </div>
                  <span>{{ getTeacherFullName(teacherId) }}</span>
                </div>
                <span v-if="row.assignments[slotType].length === 0" class="text-xs text-outline/50 italic pl-1 py-0.5">
                  Aucun enseignant assigné
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSchedule } from '~/composables/useSchedule'
import { useTeacher } from '~/composables/useTeacher'
import type { Teacher } from '~/types/teacher'

definePageMeta({
  layout: 'dashboard'
})

// Composables
const { fetchCurrentSchedule, isLoadingSchedule, currentSchedule } = useSchedule()
const { listTeachers, fetchAllTeachers } = useTeacher()

const scheduleRows = ref<any[]>([])

// --- 🛠️ RESOLUTION "ENSEIGNANT EXTERNE" ---
// Nous indexons la table d'association à la fois par 'id' de document ET par 'uid' (d'authentification)
const teachersMap = computed(() => {
  const map: Record<string, Teacher> = {}
  listTeachers.value.forEach((teacher: Teacher) => {
    if (teacher.id) {
      map[teacher.id] = teacher
    }
    if (teacher.id) {
      map[teacher.id] = teacher
    }
  })
  return map
})

onMounted(async () => {
  // Chargement simultané des données
  await Promise.all([
    fetchAllTeachers(),
    fetchCurrentSchedule().then(rows => scheduleRows.value = rows)
  ])
})

// --- RESOLUTION DES IDENTITES PEDAGOGIQUES AVEC FILTRE SÉCURISÉ ---
const getTeacherFullName = (id: string | undefined): string => {
  if (!id) return 'Enseignant non assigné'
  
  // 1. Recherche par dictionnaire indexé (ultra-rapide)
  let teacher = teachersMap.value[id]
  
  // 2. Recherche par filtre d'appoint au cas où l'indexation n'a pas fini de s'exécuter
  if (!teacher) {
    teacher = listTeachers.value.find(t => t.id === id || t.id === id)
  }
  
  if (!teacher) return 'Enseignant externe'
  return `${teacher.first_name} ${teacher.last_name}`
}

// Formatage de la période
const formatMonthKey = (monthKey: string | undefined): string => {
  if (!monthKey) return '-'
  
  if (monthKey.includes('-')) {
    const [year, month] = monthKey.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1, 1)
    const monthName = date.toLocaleString('fr-FR', { month: 'long' })
    return `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}`
  }
  
  return monthKey.charAt(0).toUpperCase() + monthKey.slice(1)
}
</script>