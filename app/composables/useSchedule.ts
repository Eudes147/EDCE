import { ref } from 'vue'

export const useSchedule = () => {
  const isPublishing = ref(false)
  const isLoadingSchedule = ref(false)
  const currentSchedule = ref<any>(null)

  // Envoi / Publication (POST)
  const saveAndPublishSchedule = async (payload: any) => {
    isPublishing.value = true
    try {
      await $fetch('/api/schedules/publish', {
        method: 'POST',
        body: payload
      })
      return true
    } catch (error) {
      console.error("Erreur lors de la publication :", error)
      return false
    } finally {
      isPublishing.value = false
    }
  }

  // Récupération / Consultation (GET)
  const fetchCurrentSchedule = async () => {
    isLoadingSchedule.value = true
    try {
      const response = await $fetch<any>('/api/schedules/current')
      if (response && response.success) {
        currentSchedule.value = response
        return response.rows
      }
      return []
    } catch (error) {
      console.error("Erreur lors de la récupération :", error)
      return []
    } finally {
      isLoadingSchedule.value = false
    }
  }

  return {
    isPublishing,
    isLoadingSchedule,
    currentSchedule,
    saveAndPublishSchedule,
    fetchCurrentSchedule
  }
}