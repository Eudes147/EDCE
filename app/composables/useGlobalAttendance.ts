import {ref} from 'vue'

import type { MeetingTeacherAttendance,MeetingAttendancePayload } from '~/types/globalAttendance'


export const useGlobalAttendance=()=>{
  const isLoading = ref<boolean>(false)
  const isSaving = ref<boolean>(false)
  
  // Stocke l'historique complet des réunions pour la vue Admin
  const savedMeetings = ref<MeetingAttendancePayload[]>([])
  
  // Stocke la feuille de présence d'une réunion spécifique pour la vue Terrain
  const activeMeetingSheet = ref<MeetingAttendancePayload | null>(null)

  /**
   * 📥 Charge TOUTES les réunions globales d'un mois spécifique (Vue Admin)
   */
  const fetchAllMeetingsByMonth = async (monthKey: string): Promise<void> => {
    isLoading.value = true
    try {
      const data = await $fetch<MeetingAttendancePayload[]>(`/api/global-attendance/${monthKey}`)
      savedMeetings.value = data || []
    } catch (error) {
      console.error("Erreur lors de la récupération des réunions mensuelles:", error)
      savedMeetings.value = []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 🔍 Cherche si une feuille d'émargement existe pour un dimanche précis (Vue Saisie Terrain)
   */
  const fetchSpecificMeetingSheet = async (monthKey: string, dateLabel: string): Promise<void> => {
    isLoading.value = true
    try {
      const data = await $fetch<MeetingAttendancePayload | null>(`/api/global-attendance/${monthKey}`, {
        query: { dateLabel }
      })
      activeMeetingSheet.value = data
    } catch (error) {
      console.error(`Erreur lors de la récupération de la réunion du ${dateLabel}:`, error)
      activeMeetingSheet.value = null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 📤 Sauvegarde (Enregistre ou Écrase) une feuille de présence de réunion (Upsert)
   */
  const saveMeetingAttendance = async (monthKey: string, payload: MeetingAttendancePayload): Promise<{ success: boolean; message: string }> => {
    isSaving.value = true
    try {
      const response = await $fetch<{ success: boolean; message: string; data: MeetingAttendancePayload }>(
        `/api/global-attendance/${monthKey}`, 
        {
          method: 'POST',
          body: payload
        }
      )
      
      // Met à jour l'état local de la feuille active après enregistrement réussi
      if (response && response.success) {
        activeMeetingSheet.value = response.data
        return { success: true, message: response.message }
      }
      
      return { success: false, message: "La sauvegarde a échoué sans erreur explicite." }
    } catch (error: any) {
      console.error("Erreur lors de l'enregistrement de la réunion:", error)
      return { 
        success: false, 
        message: error.statusMessage || "Erreur réseau lors de la sauvegarde de la réunion." 
      }
    } finally {
      isSaving.value = false
    }
  }

  return {
    isLoading,
    isSaving,
    savedMeetings,
    activeMeetingSheet,
    fetchAllMeetingsByMonth,
    fetchSpecificMeetingSheet,
    saveMeetingAttendance
  }
}