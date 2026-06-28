import { ref } from 'vue'
import { useToast } from '~/composables/useToast'

export const useSchedule = () => {
  const toast = useToast()
  const isLoading = ref(false)
  const currentSchedule = ref<any>(null)

  /**
   * 🔍 Récupère le planning d'un mois et d'une classe spécifique via l'API GET
   */
  const getScheduleByMonthAndClass = async (monthKey: string, classe: string) => {
    isLoading.value = true
    try {
      const data = await $fetch(`/api/schedules/${monthKey}`, {
        method: 'GET',
        query: { classe }
      })
      currentSchedule.value = data
      console.log("DATA",data)
      toast.success(`[Composable] Planning de ${monthKey} récupéré pour la classe ${classe}.`)
      return data
    } catch (error: any) {
      console.error('[useSchedule GET Erreur]:', error)
      toast.error(error.statusMessage || 'Impossible de charger le planning.')
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 💾 Crée ou initialise un planning pour une classe via l'API POST
   */
  const createSchedule = async (monthKey: string, classe: string, rows: any[], status: 'draft' | 'published' = 'draft') => {
    isLoading.value = true
    try {
      const response = await $fetch(`/api/schedules/${monthKey}`, {
        method: 'POST',
        body: {
          classe,
          rows,
          status
        }
      })

      toast.success(`[Composable] Planning enregistré avec succès (POST).`)
      return response
    } catch (error: any) {
      console.error('[useSchedule POST Erreur]:', error)
      toast.error(error.statusMessage || 'Erreur lors de la création du planning.')
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 📝 Met à jour un planning existant pour une classe via l'API PUT
   */
  const updateSchedule = async (monthKey: string, classe: string, rows: any[], status?: 'draft' | 'published') => {
    isLoading.value = true
    try {
      const response = await $fetch(`/api/schedules/${monthKey}`, {
        method: 'PUT',
        body: {
          classe,
          rows,
          status
        }
      })

      toast.success(`[Composable] Planning mis à jour avec succès (PUT).`)
      return response
    } catch (error: any) {
      console.error('[useSchedule PUT Erreur]:', error)
      toast.error(error.statusMessage || 'Erreur lors de la modification du planning.')
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    currentSchedule,
    getScheduleByMonthAndClass,
    createSchedule,
    updateSchedule
  }
}