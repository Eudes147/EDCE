<template>
  <div class="p-3 sm:p-4 md:p-8 max-w-[800px] mx-auto space-y-6 sm:space-y-8 animate-fade-in">
    
    <!-- ENTÊTE DE LA PAGE -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/30 pb-4">
      <div>
        <h2 class="font-h1 text-lg sm:text-xl md:text-2xl font-bold text-on-surface">Émargement Réunion Globale</h2>
        <p class="font-body text-[11px] sm:text-xs md:text-sm text-on-surface-variant mt-0.5">Présence hebdomadaire obligatoire de l'ensemble de l'équipe des moniteurs.</p>
      </div>

      <!-- SÉLECTEUR DE DIMANCHE -->
      <div class="flex items-center gap-2 w-full sm:w-auto bg-surface-container-low p-1.5 rounded-xl border border-outline-variant/40">
        <span class="text-xs font-bold text-on-surface-variant px-2 uppercase tracking-wide">Dimanche</span>
        <select 
          v-model="selectedSunday" 
          @change="syncWithSavedOrNewSheet"
          class="bg-white border border-outline-variant rounded-lg px-3 py-1.5 text-xs sm:text-sm font-semibold text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
        >
          <option v-for="sunday in currentMonthSundays" :key="sunday" :value="sunday">
            {{ sunday }}
          </option>
        </select>
      </div>
    </div>

    <!-- ZONE DE CHARGEMENT -->
    <div v-if="isLoading || isLoadingTeachers" class="p-16 text-center bg-white border border-outline-variant rounded-xl shadow-sm">
      <div class="animate-spin inline-block w-8 h-8 border-[2px] border-primary border-t-transparent rounded-full mb-3"></div>
      <p class="text-xs sm:text-sm text-on-surface-variant font-medium">Chargement de la liste des moniteurs...</p>
    </div>

    <!-- CODE PRINCIPAL / FORMULAIRE -->
    <div v-else class="space-y-6">
      
      <!-- MESSAGE D'ÉTAT DE LA FEUILLE -->
      <div :class="[
        'p-3.5 rounded-xl text-xs flex items-center gap-3 border',
        hasExistingSheet 
          ? 'bg-success/5 border-success/20 text-success' 
          : 'bg-warning/5 border-warning/20 text-warning'
      ]">
        <span class="text-base font-black">{{ hasExistingSheet ? '✓' : 'ℹ' }}</span>
        <p v-if="hasExistingSheet">
          Une feuille d'émargement a été trouvée pour ce dimanche. Modifiée par <strong>{{ activeMeetingSheet?.checkedBy }}</strong>.
        </p>
        <p v-else>
          Nouvelle feuille de réunion. Tous les moniteurs sont initialisés comme <strong>Absents</strong> par défaut.
        </p>
      </div>

      <!-- LISTE DES MONITEURS -->
      <div class="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden divide-y divide-outline-variant/40">
        <div v-if="localAttendanceList.length === 0" class="p-8 text-center text-on-surface-variant text-xs sm:text-sm">
          Aucun moniteur enregistré dans la base de données.
        </div>

        <div 
          v-for="item in localAttendanceList" 
          :key="item.teacherId" 
          class="p-3 sm:p-4 flex items-center justify-between gap-4 hover:bg-surface-container-lowest/50 transition-colors"
        >
          <!-- Identité du Moniteur -->
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center font-bold text-xs uppercase border border-outline-variant/40 shrink-0">
              {{ item.firstName.charAt(0) }}{{ item.lastName.charAt(0) }}
            </div>
            <div class="min-w-0">
              <p class="text-xs sm:text-sm font-semibold text-on-surface truncate">
                {{ item.firstName }} {{ item.lastName }}
              </p>
              <p class="text-[10px] text-on-surface-variant uppercase tracking-wider font-medium">Moniteur</p>
            </div>
          </div>

          <!-- Bouton à bascule Présent / Absent (Toggle) -->
          <button
            @click="item.isPresent = !item.isPresent"
            type="button"
            :class="[
              'px-3 py-1.5 rounded-lg text-xs font-bold border transition-all duration-200 shadow-sm shrink-0 min-w-[85px] text-center',
              item.isPresent
                ? 'bg-on-primary-fixed text-white border-success hover:bg-on-primary-fixed-variant'
                : 'bg-error text-on-error border-outline-variant hover:bg-surface-container-high'
            ]"
          >
            {{ item.isPresent ? 'Présent ✓' : 'Absent' }}
          </button>
        </div>
      </div>

      <!-- BOUTON D'ENREGISTREMENT PRINCIPAL -->
      <div class="flex justify-end pt-2">
        <button
          @click="submitMeetingAttendance"
          type="button"
          :disabled="isSaving || localAttendanceList.length === 0"
          class="w-full sm:w-auto bg-primary hover:bg-primary-hover disabled:bg-outline/20 disabled:text-on-surface/40 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2"
        >
          <span v-if="isSaving" class="animate-spin inline-block w-4 h-4 border-[2px] border-white border-t-transparent rounded-full"></span>
          {{ isSaving ? 'Enregistrement sécurisé...' : 'Sauvegarder l\'émargement' }}
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { MeetingTeacherAttendance,MeetingAttendancePayload } from '~/types/globalAttendance'
import { useTeacher } from '~/composables/useTeacher'
import { useGlobalAttendance } from '~/composables/useGlobalAttendance'
import {useToast} from '~/composables/useToast'

definePageMeta({
  layout: 'dashboard'
})

// Accès aux services réactifs
const toast=useToast()
const { listTeachers, fetchAllTeachers, isLoading: isLoadingTeachers } = useTeacher()
const { isLoading, isSaving, activeMeetingSheet, fetchSpecificMeetingSheet, saveMeetingAttendance } = useGlobalAttendance()

// 📅 Détermination dynamique du mois en cours
const now = new Date()
const currentMonthKey = computed<string>(() => {
  const year = now.getFullYear()
  const monthStr = String(now.getMonth() + 1).padStart(2, '0')
  return `${year}-${monthStr}`
})

// Référence pour le dimanche sélectionné sur le terrain
const selectedSunday = ref<string>('')

// Structure de réactivité locale pour manipuler l'état des toggles
interface LocalTeacherAttendance {
  teacherId: string
  firstName: string
  lastName: string
  isPresent: boolean
}
const localAttendanceList = ref<LocalTeacherAttendance[]>([])

/**
 * 📆 Génère dynamiquement tous les dimanches du mois en cours
 */
const currentMonthSundays = computed<string[]>(() => {
  const sundays: string[] = []
  const year = now.getFullYear()
  const month = now.getMonth()
  
  const date = new Date(year, month, 1)
  
  while (date.getDay() !== 0) {
    date.setDate(date.getDate() + 1)
  }
  
  while (date.getMonth() === month) {
    const dayStr = String(date.getDate()).padStart(2, '0')
    const monthLabel = date.toLocaleString('fr-FR', { month: 'long' })
    const capitalizedMonth = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)
    
    sundays.push(`Dimanche ${dayStr} ${capitalizedMonth}`)
    date.setDate(date.getDate() + 7)
  }
  
  return sundays
})

// Indicateur pour savoir si le dimanche possède déjà un historique en BDD
const hasExistingSheet = computed<boolean>(() => activeMeetingSheet.value !== null)

/**
 * 🔄 Synchronise la liste locale d'émargement avec les données distantes (ou crée un canevas vierge)
 */
const syncWithSavedOrNewSheet = async (): Promise<void> => {
  if (!selectedSunday.value) return

  // Appel API pour chercher une feuille préexistante
  await fetchSpecificMeetingSheet(currentMonthKey.value, selectedSunday.value)

  // Mapping intelligent et sécurisation contre le type 'undefined' de l'id
  localAttendanceList.value = listTeachers.value.map(teacher => {
    let savedPresenceStatus = false
    const teacherIdSafe = teacher.id || ''
    
    if (activeMeetingSheet.value && Array.isArray(activeMeetingSheet.value.assignments)) {
      const match = activeMeetingSheet.value.assignments.find(a => a.teacherId === teacherIdSafe)
      if (match) {
        savedPresenceStatus = match.isPresent
      }
    }

    return {
      teacherId: teacherIdSafe,
      firstName: teacher.first_name || 'Inconnu',
      lastName: teacher.last_name || 'Moniteur',
      isPresent: savedPresenceStatus
    }
  })
}

// Initialisation globale au montage du composant
onMounted(async () => {
  if (currentMonthSundays.value.length > 0) {
    selectedSunday.value = currentMonthSundays.value[0] || ""
  }

  await fetchAllTeachers()
  await syncWithSavedOrNewSheet()
})

/**
 * 📤 Soumission et enregistrement de l'état global
 */
const submitMeetingAttendance = async (): Promise<void> => {
  if (!selectedSunday.value || localAttendanceList.value.length === 0) return

  const assignmentsPayload = localAttendanceList.value.map(item => ({
    teacherId: item.teacherId,
    isPresent: item.isPresent
  }))

  const finalPayload = {
    monthKey: currentMonthKey.value,
    dateLabel: selectedSunday.value,
    checkedAt: new Date().toISOString(),
    checkedBy: "Secrétariat EDCE",
    assignments: assignmentsPayload
  }

  // Utilisation de as any pour contourner le conflit d'import de l'interface
  const result = await saveMeetingAttendance(currentMonthKey.value, finalPayload as any)
  
  if (result.success) {
    await syncWithSavedOrNewSheet()
    toast.success("Emargement enregistrée")

  } else {
    toast.warning(result.message)
  }
}
</script>