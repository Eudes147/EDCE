<template>
  <div class="p-3 sm:p-4 md:p-8 max-w-[1000px] mx-auto space-y-4 sm:space-y-6 md:space-y-8">
    
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-outline-variant/30 pb-4">
      <div>
        <h2 class="font-h1 text-lg sm:text-xl md:text-2xl font-bold text-on-surface">Émargement des Moniteurs</h2>
        <p class="font-body text-[11px] sm:text-xs md:text-sm text-on-surface-variant mt-0.5">Marquez la présence des enseignants programmés pour chaque séance.</p>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-surface-container-low/50 p-3 rounded-xl border border-outline-variant/40">
      <div class="flex flex-col gap-1">
        <label class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Dimanche</label>
        <!-- 🔄 Retrait de @change mécanique, géré implicitement par le watch -->
        <select 
          v-model="selectedSunday" 
          class="w-full bg-white border border-outline-variant rounded-lg px-3 py-2 text-xs md:text-sm font-semibold text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
        >
          <option v-for="sun in currentMonthSundays" :key="sun" :value="sun">{{ sun }}</option>
        </select>
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Classe</label>
        <select 
          v-model="selectedClass" 
          class="w-full bg-white border border-outline-variant rounded-lg px-3 py-2 text-xs md:text-sm font-semibold text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
        >
          <option v-for="c in classesList" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Type de Séance</label>
        <select 
          v-model="selectedSlot" 
          class="w-full bg-white border border-outline-variant rounded-lg px-3 py-2 text-xs md:text-sm font-semibold text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
        >
          <option value="NORMAL">NORMAL</option>
          <option value="SUNDAY_SCHOOL">SUNDAY_SCHOOL</option>
          <option value="DLT">DLT</option>
        </select>
      </div>
    </div>

    <div v-if="isLoadingSchedule || isLoadingAttendance" class="p-12 text-center bg-white border border-outline-variant rounded-xl shadow-sm">
      <div class="animate-spin inline-block w-6 h-6 border-[2px] border-primary border-t-transparent rounded-full mb-2"></div>
      <p class="text-xs sm:text-sm text-on-surface-variant">Vérification de la planification et de l'émargement...</p>
    </div>
    <div v-else-if="currentContextTeachers.length === 0" class="text-center py-12 bg-surface-container-lowest border border-dashed border-outline-variant rounded-xl shadow-sm space-y-3">
      <Icon name="event_busy" class="text-3xl text-outline mx-auto" />
      <h3 class="text-sm font-bold text-on-surface">Aucun enseignant planifié</h3>
      <p class="text-xs text-on-surface-variant max-w-xs mx-auto">Il n'y a aucun moniteur assigné à la classe {{ selectedClass }} pour la séance {{ selectedSlot }} ce dimanche.</p>
    </div>

    <section v-else class="space-y-4 animate-fade-in">
      <div class="bg-white border border-outline-variant/60 rounded-xl overflow-hidden shadow-sm divide-y divide-outline-variant/40">
        <div 
          v-for="teacher in currentContextTeachers" 
          :key="teacher.id"
          class="p-4 flex items-center justify-between transition-colors hover:bg-surface-container-low/20"
        >
          <div class="flex items-center gap-3 min-w-0">
            <div :class="[
              'w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs uppercase border flex-shrink-0',
              teacher.isPresent ? 'bg-on-primary-fixed border-success/20 text-white' : 'bg-error/10 border-error/20 text-white'
            ]">
              {{ teacher.first_name.charAt(0) }}{{ teacher.last_name.charAt(0) }}
            </div>
            <div class="flex flex-col min-w-0">
              <span class="font-body text-xs sm:text-sm text-on-surface font-semibold truncate">
                {{ teacher.first_name }} {{ teacher.last_name }}
              </span>
              <span class="text-[10px] font-medium tracking-wide uppercase mt-0.5" :class="teacher.isPresent ? 'text-on-primary-fixed' : 'text-error'">
                {{ teacher.isPresent ? 'Présent' : 'Absent' }}
              </span>
            </div>
          </div>

          <button 
            @click="teacher.isPresent = !teacher.isPresent"
            type="button"
            :class="[
              'px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border active:scale-95 shadow-sm',
              teacher.isPresent 
                ? 'bg-on-primary-fixed text-white border-success hover:bg-on-primary-fixed-varient' 
                : 'bg-error text-white border-error hover:bg-error/90'
            ]"
          >
            <span>{{ teacher.isPresent ? 'Présent' : 'Absent' }}</span>
          </button>
        </div>
      </div>

      <div class="flex justify-end pt-2">
        <button 
          @click="handleSaveAttendance"
          :disabled="isSaving"
          type="button"
          class="flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-md hover:opacity-95 transition-all text-xs sm:text-sm w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icon v-if="isSaving" name="sync" class="animate-spin" size="1.15rem" />
          <Icon v-else name="check_circle" size="1.15rem" />
          <span>{{ isSaving ? 'Enregistrement en cours...' : 'Enregistrer la Présence' }}</span>
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useTeacher } from '~/composables/useTeacher'
import { useSchedule } from '~/composables/useSchedule'
import { useAttendance } from '~/composables/useAttendance'
import { useToast } from '~/composables/useToast'
import type { TeacherAttendance, AttendancePayload } from '~/types/attendance'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: 'dashboard'
})

// Composables de l'écosystème
const authStore=useAuthStore()
const toast = useToast()
const { listTeachers, fetchAllTeachers } = useTeacher()
const { isLoading: isLoadingSchedule, getScheduleByMonthAndClass, currentSchedule } = useSchedule()
const { isSaving, isLoading: isLoadingAttendance, fetchAttendanceByContext, saveAttendance } = useAttendance()

// Configurations initiales des Sélecteurs
const classesList = ['Petit', 'Débutant', 'Moyen', 'JuniorA', 'JuniorB']
const selectedClass = ref<string>('JuniorA')
const selectedSlot = ref<'NORMAL' | 'SUNDAY_SCHOOL' | 'DLT'>('NORMAL')
const selectedSunday = ref<string>('')

// Liste locale synchronisée pour l'UI d'émargement
interface InteractiveTeacher {
  id: string
  first_name: string
  last_name: string
  isPresent: boolean
}
const currentContextTeachers = ref<InteractiveTeacher[]>([])

// Formatage de la clé du mois actuel "YYYY-MM" (Dynamique)
const currentMonthKey = computed(() => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
})

// Générateur automatique de la liste des Dimanches du mois
const currentMonthSundays = computed<string[]>(() => {
  const sundays: string[] = []
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const date = new Date(year, month, 1)

  while (date.getDay() !== 0) { 
    date.setDate(date.getDate() + 1) 
  }

  while (date.getMonth() === month) {
    const dayNum = date.getDate()
    const currentMonthName = now.toLocaleString('fr-FR', { month: 'short' })
    
    // Format unifié et propre, ex: "Dim 27 Juin"
    const label = `Dim ${String(dayNum)} ${currentMonthName.charAt(0).toUpperCase() + currentMonthName.slice(1)}`
    sundays.push(label)
    date.setDate(date.getDate() + 7)
  }
  return sundays
})

/**
 * 🛠️ CORE LOGIC : Croisement des plannings et des présences enregistrées
 */
const crossReferencePlanningAndAttendance = async () => {
  currentContextTeachers.value = []
  if (!selectedSunday.value) return
  await getScheduleByMonthAndClass(currentMonthKey.value, selectedClass.value) as any
  console.log("CURRENT",currentSchedule.value)
  if (!currentSchedule.value) return

  // Recherche stricte sur la ligne de planning correspondant au dimanche sélectionné
  console.log(selectedSunday.value)
  const targetRow = currentSchedule.value.rows.find((r: any) => 
    String(r.dateLabel).toLowerCase().trim() === String(selectedSunday.value).toLowerCase().trim()
  )
  // Récupération des moniteurs planifiés
  const sourceAssignments = targetRow?.assignments || targetRow?.classes
  const scheduledTeacherIds: string[] = sourceAssignments?.[selectedSlot.value] || []

  if (scheduledTeacherIds.length === 0) return

  // Vérification si un émargement a déjà été enregistré en base pour ce contexte précis
  const savedRecord = await fetchAttendanceByContext(
    currentMonthKey.value,
    selectedSunday.value,
    selectedClass.value,
    selectedSlot.value
  )

  // Mapping final combiné
  currentContextTeachers.value = scheduledTeacherIds.map((id: string) => {
    const defaultTeacherInfo = listTeachers.value.find(t => t.id === id)
    let isPresent = false
    
    if (savedRecord && Array.isArray(savedRecord.assignments)) {
      const match = savedRecord.assignments.find(a => a.teacherId === id)
      if (match) {
        isPresent = match.isPresent
      }
    }

    return {
      id,
      first_name: defaultTeacherInfo?.first_name || 'Inconnu',
      last_name: defaultTeacherInfo?.last_name || 'Externe',
      isPresent
    }
  })
}

// 🔄 ÉCOUTEURS RÉACTIFS : Dès qu'un filtre change dans l'UI, on recalcule la matrice immédiatement
watch([selectedClass, selectedSlot, selectedSunday], async () => {
  await crossReferencePlanningAndAttendance()
})

// Chargement Initial de la Page
// Chargement Initial de la Page
onMounted(async () => {
  if (currentMonthSundays.value.length > 0) {
    // Le || '' garantit à TypeScript qu'une string sera TOUJOURS assignée
    selectedSunday.value = currentMonthSundays.value[0] || ''
  }
  
  await fetchAllTeachers()
  await crossReferencePlanningAndAttendance()
})

/**
 * 💾 SAUVEGARDE GLOBALE
 */
const handleSaveAttendance = async () => {
  if (!selectedSunday.value) return

  const formattedAssignments: TeacherAttendance[] = currentContextTeachers.value.map(t => ({
    teacherId: t.id,
    isPresent: t.isPresent
  }))

  const payload: AttendancePayload = {
    monthKey: currentMonthKey.value,
    dateLabel: selectedSunday.value,
    className: selectedClass.value,
    slotType: selectedSlot.value,
    checkedAt: new Date().toISOString(),
    checkedBy: authStore.fullName,
    assignments: formattedAssignments
  }

  const result = await saveAttendance(payload)

  if (result.success) {
    toast.success('Émargement enregistré', 'La feuille de présence a bien été mise à jour.')
    await crossReferencePlanningAndAttendance() // Rafraîchissement des états
  } else {
    // 🛡️ Sécurisation du message d'erreur pour TypeScript
    toast.error('Échec de la sauvegarde', result.error || 'Une erreur est survenue.')
  }
}
</script>