<template>
  <div class="p-8 max-w-[1400px] mx-auto space-y-8">
    <div class="flex justify-between items-center border-b border-outline-variant/50 pb-6">
      <div>
        <h2 class="font-h1 text-h1 text-on-surface text-2xl font-bold">Planning des Enseignants</h2>
        <p class="font-body text-body text-on-surface-variant mt-2">Consultez vos affectations officielles pour le mois en cours.</p>
      </div>
      <div v-if="currentSchedule?.monthKey" class="bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
        <Icon name="calendar_month" class="text-base" />
        <span>Période : {{ formatMonthKey(currentSchedule.monthKey) }}</span>
      </div>
    </div>

    <div v-if="isLoadingSchedule" class="p-12 text-center bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm">
      <div class="animate-spin inline-block w-6 h-6 border-[3px] border-primary border-t-transparent rounded-full mb-3"></div>
      <p class="text-sm text-on-surface-variant">Récupération du calendrier en cours...</p>
    </div>

    <div v-else-if="scheduleRows.length === 0" class="text-center py-16 bg-surface-container-lowest border border-dashed border-outline-variant rounded-xl shadow-sm space-y-3">
      <Icon name="event_busy" class="text-4xl text-outline" />
      <h3 class="text-base font-bold text-on-surface">Aucun planning publié</h3>
      <p class="text-sm text-on-surface-variant max-w-md mx-auto">L'emploi du temps de ce mois n'a pas encore été validé par l'équipe administrative.</p>
    </div>

    <section v-else class="space-y-4 animate-fade-in">
      <div class="grid grid-cols-4 gap-1 bg-outline-variant/30 border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        
        <div class="bg-surface-container-high p-4 font-bold text-on-surface text-center text-sm">Dates (Dimanches)</div>
        <div class="bg-surface-container-high p-4 font-bold text-primary text-center text-sm">NORMAL</div>
        <div class="bg-surface-container-high p-4 font-bold text-secondary text-center text-sm">SUNDAY_SCHOOL</div>
        <div class="bg-surface-container-high p-4 font-bold text-tertiary text-center text-sm">DLT</div>

        <template v-for="row in scheduleRows" :key="row.dateLabel">
          
          <div class="bg-surface-container-low p-4 flex items-center justify-center font-bold text-on-surface text-sm border-r border-outline-variant/30">
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

// --- OPTIMISATION : INDEXATION DES ENSEIGNANTS ---
const teachersMap = computed(() => {
  const map: Record<string, Teacher> = {}
  listTeachers.value.forEach((teacher: Teacher) => {
    map[teacher.id] = teacher
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

// --- CORRECTION ICI : Acceptation de string | undefined ---
const getTeacherFullName = (id: string | undefined): string => {
  if (!id) return 'Enseignant non assigné'
  
  const teacher = teachersMap.value[id]
  if (!teacher) return 'Enseignant externe'
  return `${teacher.first_name} ${teacher.last_name}`
}

// Formatage de la période (déjà sécurisé)
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