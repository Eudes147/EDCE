<template>
  <div class="p-3 sm:p-4 md:p-8 max-w-[1000px] mx-auto space-y-4 sm:space-y-6 md:space-y-8">
    
    <!-- En-tête de la Page -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-outline-variant/30 pb-4">
      <div>
        <h2 class="font-h1 text-lg sm:text-xl md:text-2xl font-bold text-on-surface">Administration des Présences Réunions</h2>
        <p class="font-body text-[11px] sm:text-xs md:text-sm text-on-surface-variant mt-0.5">
          Consultez et modifiez les feuilles d'émargement globales des réunions mensuelles.
        </p>
      </div>
    </div>

    <!-- Filtres d'Administration -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-surface-container-low/50 p-3 rounded-xl border border-outline-variant/40">
      <!-- Sélection du Mois Clé -->
      <div class="flex flex-col gap-1">
        <label class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Mois d'activité</label>
        <input 
          v-model="selectedMonthInput" 
          type="month"
          class="w-full bg-white border border-outline-variant rounded-lg px-3 py-1.5 text-xs md:text-sm font-semibold text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
        />
      </div>

      <!-- Sélection de la Réunion/Date chargée -->
      <div class="flex flex-col gap-1">
        <label class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Feuille de réunion</label>
        <select 
          v-model="selectedDateLabel" 
          :disabled="savedMeetings.length === 0"
          class="w-full bg-white border border-outline-variant rounded-lg px-3 py-2 text-xs md:text-sm font-semibold text-on-surface focus:ring-2 focus:ring-primary focus:outline-none disabled:opacity-50"
        >
          <option value="" disabled>Choisir une réunion...</option>
          <option v-for="meeting in savedMeetings" :key="meeting.dateLabel" :value="meeting.dateLabel">
            {{ meeting.dateLabel }}
          </option>
        </select>
      </div>

      <!-- Statut de Filtrage UI -->
      <div class="flex flex-col gap-1">
        <label class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Filtrer l'affichage</label>
        <select 
          v-model="statusFilter" 
          class="w-full bg-white border border-outline-variant rounded-lg px-3 py-2 text-xs md:text-sm font-semibold text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
        >
          <option value="ALL">Tous les moniteurs</option>
          <option value="PRESENT">Présents</option>
          <option value="ABSENT">Absents</option>
        </select>
      </div>
    </div>

    <!-- Indicateur de Chargement -->
    <div v-if="isLoading" class="p-12 text-center bg-white border border-outline-variant rounded-xl shadow-sm">
      <div class="animate-spin inline-block w-6 h-6 border-[2px] border-primary border-t-transparent rounded-full mb-2"></div>
      <p class="text-xs sm:text-sm text-on-surface-variant">Récupération des données d'émargement...</p>
    </div>

    <!-- État Vide : Aucun enregistrement trouvé pour ce mois -->
    <div v-else-if="savedMeetings.length === 0" class="text-center py-12 bg-surface-container-lowest border border-dashed border-outline-variant rounded-xl shadow-sm space-y-3">
      <Icon name="event_busy" class="text-3xl text-outline mx-auto" />
      <h3 class="text-sm font-bold text-on-surface">Aucune réunion enregistrée</h3>
      <p class="text-xs text-on-surface-variant max-w-xs mx-auto">Il n'y a aucun émargement de réunion soumis pour le mois de {{ selectedMonthInput }}.</p>
    </div>

    <!-- État Vide : Aucune réunion sélectionnée parmi la liste du mois -->
    <div v-else-if="!selectedDateLabel" class="text-center py-12 bg-surface-container-lowest border border-dashed border-outline-variant rounded-xl shadow-sm space-y-3">
      <Icon name="info" class="text-3xl text-outline mx-auto" />
      <h3 class="text-sm font-bold text-on-surface">Sélectionnez une réunion</h3>
      <p class="text-xs text-on-surface-variant max-w-xs mx-auto">Veuillez choisir une feuille de réunion spécifique parmi celles trouvées ce mois-ci.</p>
    </div>

    <!-- Liste des Présences & Actions -->
    <section v-else class="space-y-4 animate-fade-in">
      
      <!-- Actions de Masse & Compteur -->
      <div class="flex justify-between items-center px-1">
        <span class="text-xs font-semibold text-on-surface-variant">
          {{ presentCount }} présent(s) sur {{ meetingAttendanceList.length }} au total
        </span>
        <div class="flex gap-2">
          <button 
            @click="setAllAttendanceStatus(true)"
            type="button"
            class="text-[11px] font-bold text-primary uppercase tracking-wider hover:underline"
          >
            Tout présent
          </button>
          <span class="text-outline-variant">|</span>
          <button 
            @click="setAllAttendanceStatus(false)"
            type="button"
            class="text-[11px] font-bold text-error uppercase tracking-wider hover:underline"
          >
            Tout absent
          </button>
        </div>
      </div>

      <!-- Liste d'Émargement -->
      <div class="bg-white border border-outline-variant/60 rounded-xl overflow-hidden shadow-sm divide-y divide-outline-variant/40">
        <div 
          v-for="teacher in filteredTeachers" 
          :key="teacher.id"
          class="p-4 flex items-center justify-between transition-colors hover:bg-surface-container-low/20"
        >
          <div class="flex items-center gap-3 min-w-0">
            <div :class="[
              'w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs uppercase border flex-shrink-0',
              teacher.isPresent ? 'bg-success/10 border-success/20 text-success' : 'bg-error/10 border-error/20 text-error'
            ]">
              {{ teacher.first_name.charAt(0) }}{{ teacher.last_name.charAt(0) }}
            </div>
            <div class="flex flex-col min-w-0">
              <span class="font-body text-xs sm:text-sm text-on-surface font-semibold truncate">
                {{ teacher.first_name }} {{ teacher.last_name }}
              </span>
              <span class="text-[10px] font-medium tracking-wide uppercase mt-0.5" :class="teacher.isPresent ? 'text-success' : 'text-error'">
                {{ teacher.isPresent ? 'Présent' : 'Absent' }}
              </span>
            </div>
          </div>

          <!-- Switch d'action individuel -->
          <button 
            @click="teacher.isPresent = !teacher.isPresent"
            type="button"
            :class="[
              'px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border active:scale-95 shadow-sm',
              teacher.isPresent 
                ? 'bg-on-primary-fixed text-white border-success hover:bg-on-primary-fixed-variant' 
                : 'bg-error text-white border-error hover:bg-error/90'
            ]"
          >
            <span>{{ teacher.isPresent ? 'Présent' : 'Absent' }}</span>
          </button>
        </div>
      </div>

      <!-- Zone de validation finale -->
      <div class="flex justify-end pt-2">
        <button 
          @click="handleSaveMeetingAttendance"
          :disabled="isSaving"
          type="button"
          class="flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-md hover:opacity-95 transition-all text-xs sm:text-sm w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icon v-if="isSaving" name="sync" class="animate-spin" size="1.15rem" />
          <Icon v-else name="save" size="1.15rem" />
          <span>{{ isSaving ? 'Mettre à jour la feuille' : 'Enregistrer les modifications' }}</span>
        </button>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useTeacher } from '~/composables/useTeacher'
import { useGlobalAttendance } from '~/composables/useGlobalAttendance'
import { useToast } from '~/composables/useToast'
import type { MeetingTeacherAttendance, MeetingAttendancePayload } from '~/types/globalAttendance'

definePageMeta({
  layout: 'dashboard'
})

// Composables du système
const toast = useToast()
const { listTeachers, fetchAllTeachers } = useTeacher()
const { isLoading, isSaving, savedMeetings, fetchAllMeetingsByMonth, saveMeetingAttendance } = useGlobalAttendance()

// États locaux des filtres (Format HTML5 "YYYY-MM")
const selectedMonthInput = ref<string>('')
const selectedDateLabel = ref<string>('')
const statusFilter = ref<'ALL' | 'PRESENT' | 'ABSENT'>('ALL')

// Interface UI locale réactive pour piloter la liste
interface InteractiveMeetingTeacher {
  id: string
  first_name: string
  last_name: string
  isPresent: boolean
}
const meetingAttendanceList = ref<InteractiveMeetingTeacher[]>([])

// Initialisation au montage
onMounted(async () => {
  const now = new Date()
  selectedMonthInput.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  await fetchAllTeachers()
})

// Déclencheur réactif sur le changement de mois d'activité
watch(selectedMonthInput, async (newMonth) => {
  selectedDateLabel.value = ''
  meetingAttendanceList.value = []
  if (newMonth) {
    await fetchAllMeetingsByMonth(newMonth)
  }
}, { immediate: true })

// Déclencheur réactif lors de la sélection d'une feuille de réunion spécifique du mois
watch(selectedDateLabel, (newDateLabel) => {
  if (!newDateLabel) {
    meetingAttendanceList.value = []
    return
  }

  // Retrouver la réunion sélectionnée dans la liste
  const matchedMeeting = savedMeetings.value.find(m => m.dateLabel === newDateLabel)

  // Construction sécurisée de la matrice d'émargement
  meetingAttendanceList.value = listTeachers.value.map(teacher => {
    let isPresent = false

    if (matchedMeeting && Array.isArray(matchedMeeting.assignments)) {
      const match = matchedMeeting.assignments.find(a => a.teacherId === teacher.id)
      if (match) {
        isPresent = match.isPresent
      }
    }

    return {
      id: teacher.id,
      first_name: teacher.first_name,
      last_name: teacher.last_name,
      isPresent
    }
  })
})

// Filtrage local pour l'UI
const filteredTeachers = computed<InteractiveMeetingTeacher[]>(() => {
  if (statusFilter.value === 'PRESENT') {
    return meetingAttendanceList.value.filter(t => t.isPresent)
  }
  if (statusFilter.value === 'ABSENT') {
    return meetingAttendanceList.value.filter(t => !t.isPresent)
  }
  return meetingAttendanceList.value
})

// Compteur des présences
const presentCount = computed<number>(() => {
  return meetingAttendanceList.value.filter(t => t.isPresent).length
})

// Actions de masse
const setAllAttendanceStatus = (status: boolean) => {
  meetingAttendanceList.value.forEach(teacher => {
    teacher.isPresent = status
  })
}

/**
 * 💾 SAUVEGARDE ET REMISE À JOUR DES ÉTATS
 */
const handleSaveMeetingAttendance = async () => {
  if (!selectedMonthInput.value || !selectedDateLabel.value) return

  const formattedAssignments: MeetingTeacherAttendance[] = meetingAttendanceList.value.map(t => ({
    teacherId: t.id,
    isPresent: t.isPresent
  }))

  // 🎯 Payload rigoureusement mappé avec l'interface MeetingAttendancePayload
  const payload: MeetingAttendancePayload = {
    monthKey: selectedMonthInput.value,
    dateLabel: selectedDateLabel.value,
    checkedAt: new Date().toISOString(),
    checkedBy: 'Administrateur',
    assignments: formattedAssignments
  }

  const result = await saveMeetingAttendance(selectedMonthInput.value, payload)

  if (result.success) {
    toast.success('Mise à jour réussie', result.message)
    // Synchronisation locale immédiate de l'état du composable
    await fetchAllMeetingsByMonth(selectedMonthInput.value)
  } else {
    toast.error('Erreur', result.message)
  }
}
</script>