import { ref } from 'vue'
import type { AttendancePayload } from '~/types/attendance'

export const useAttendance = () => {
  const isLoading = ref<boolean>(false)
  const isSaving = ref<boolean>(false)
  const savedAttendances = ref<AttendancePayload[]>([])

  /**
   * Récupère une feuille de présence précise pour un contexte donné (Saisie Terrain)
   */
  const fetchAttendanceByContext = async (
    monthKey: string,
    dateLabel: string,
    className: string,
    slotType: string
  ): Promise<AttendancePayload | null> => {
    isLoading.value = true
    try {
      return await $fetch<AttendancePayload | null>(`/api/attendance/${monthKey}`, {
        method: 'GET',
        query: { className, slotType, dateLabel }
      })
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'émargement:', error)
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Récupère la totalité des feuilles de présences pour un mois donné (Dashboard Admin)
   */
  const fetchAllAttendancesByMonth = async (monthKey: string): Promise<void> => {
    isLoading.value = true
    try {
      const data = await $fetch<AttendancePayload[]>(`/api/attendance/${monthKey}`, {
        method: 'GET'
      })
      savedAttendances.value = data || []
    } catch (error) {
      console.error('Erreur lors de la récupération globale des présences:', error)
      savedAttendances.value = []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Envoie le payload de présence au serveur (et gère le verrouillage du bouton)
   */
  const saveAttendance = async (payload: AttendancePayload): Promise<{ success: boolean; error?: string }> => {
    isSaving.value = true
    try {
      // Simulation d'une latence réseau légère (500ms) pour bien valider visuellement la désactivation du bouton
      await new Promise((resolve) => setTimeout(resolve, 500))

      await $fetch(`/api/attendance/${payload.monthKey}`, {
        method: 'POST',
        body: payload
      })
      return { success: true }
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde des présences:', error)
      return { success: false, error: error.statusMessage || 'Impossible de sauvegarder la feuille d\'émargement.' }
    } finally {
      isSaving.value = false
    }
  }

  return {
    isLoading,
    isSaving,
    savedAttendances,
    fetchAttendanceByContext,
    fetchAllAttendancesByMonth,
    saveAttendance
  }
}