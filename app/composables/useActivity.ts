import { ref } from 'vue'
import { useToast } from '~/composables/useToast'
import type { Activity, EventActivity } from '~/types/activity'

export const useActivities = () => {
  const toast = useToast()
  const listActivities = ref<Activity[]>([])
  const listActivityAtEvent = ref<EventActivity[]>([])
  const listEvent = ref<any[]>([])
  const groupActivityperYear = ref<Record<string, Activity[]>>({})
  const groupActivityperEvent = ref<Record<string, Activity[]>>({})
  const isLoading = ref(true)

  // 🔄 1. Charger toutes les données depuis le serveur
  const fetchAllData = async () => {
    isLoading.value = true
    try {
      const [activitiesData, eventsData] = await Promise.all([
        $fetch<Activity[]>('/api/activities'),
        $fetch<any>('/api/events')
      ])

      listActivities.value = activitiesData || []
      listActivityAtEvent.value = eventsData.listActivityAtEvent || []
      listEvent.value = eventsData.listEvent || []
      groupActivityperYear.value = eventsData.groupActivityperYear || {}
      groupActivityperEvent.value = eventsData.groupActivityperEvent || {}
    } catch (error) {
      console.error("Erreur lors de la récupération des activités :", error)
      toast.error('Erreur de chargement', 'Impossible de synchroniser le calendrier des événements.')
    } finally {
      isLoading.value = false
    }
  }
  const isExist =(title:string)=>{
    return listActivities.value.find(activity=>activity.title.trim().toLowerCase() == title.trim().toLowerCase())
  }

  // ➕ 2. Créer une activité globale (le modèle d'activité)
  const createActivity = async (title: string) => {
    if(!isExist(title)){
      try {
      await $fetch('/api/activities', {
        method: 'POST',
        body: { title }
      })
      await fetchAllData()
      toast.success('Activité créée', `L'activité ${title} est disponible.`)
    } catch (error) {
      console.error(error)
      toast.error('Erreur', 'Impossible de générer cette activité.')
    }
    }
    else{
      toast.warning('Attention! Activité déja inscrite...')
    }
    
  }

  // ❌ 3. Supprimer une activité globale
  const deleteActivity = async (activityId: string) => {
    try {
      await $fetch(`/api/activities/${activityId}`, { method: 'DELETE' })
      await fetchAllData()
      toast.success('Activité supprimée', 'L\'activité a été retirée du catalogue global.')
    } catch (error) {
      console.error(error)
    }
  }

  // 📝 4. Modifier une activité globale
  const updateActivity = async (activityId: string, updatedTitle: string) => {
    if(!isExist(updatedTitle)){
      try {
      await $fetch(`/api/activities/${activityId}`, {
        method: 'PUT',
        body: { title: updatedTitle }
      })
      await fetchAllData()
    } catch (error) {
      console.error(error)
    }
    }
    else{
      toast.warning('Attention! Activité déja inscrite...')
    }
  }

  // ➕ 5. Lier une activité à un événement annuel
  const createActivityAtEvent = async (activityId: string, eventType: string, year: string) => {
    try {
      await $fetch('/api/events', {
        method: 'POST',
        body: { activityId, eventType, year }
      })
      await fetchAllData()
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  // ❌ 6. Supprimer une liaison spécifique entre une activité et un événement
  const deleteActivityAtEvent = async (eventRelationId: string) => {
    try {
      await $fetch(`/api/events/${eventRelationId}`, { method: 'DELETE' })
      await fetchAllData()
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  // ⚡ 7. Traitement par lot (Utile pour les interfaces de type Checkbox en Modale)
  const syncEventActivity = async (activityId: string, eventType: string, year: string, isChecked: boolean) => {
    isLoading.value = true
    try {
      if (isChecked) {
        await createActivityAtEvent(activityId, eventType, year)
      } else {
        // Trouver la liaison existante correspondant à ce couple
        const relation = listActivityAtEvent.value.find(
          item => item.activityId === activityId && item.eventType === eventType && item.year === year
        )
        if (relation?.id) {
          await deleteActivityAtEvent(relation.id)
        }
      }
    } catch (err) {
      toast.error('Erreur de synchronisation', 'La modification n\'a pas pu être sauvegardée.')
    } finally {
      isLoading.value = false
    }
  }

  return {
    listActivities,
    listEvent,
    groupActivityperYear,
    groupActivityperEvent,
    listActivityAtEvent,
    isLoading,
    fetchAllData,
    createActivity,
    deleteActivity,
    updateActivity,
    createActivityAtEvent,
    deleteActivityAtEvent,
    syncEventActivity
  }
}