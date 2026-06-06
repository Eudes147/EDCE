import { ref, computed } from 'vue'
import { mockActivities, mockActivityatEvent } from '~/data/mockData'
import type { Activity, EventActivity } from '~/types/activity'

export const useActivities = () => {
  const listActivities = ref<Activity[]>(mockActivities) 
  const listActivityAtEvent = ref<EventActivity[]>(mockActivityatEvent)

  // --- CRUD ACTIVITIES ---
  const createActivity = (activity: Activity) => {
    if (activity.id && activity.title) {
      listActivities.value.push(activity)
    }
  }

  const deleteActivity = (activityId: string) => {
    listActivities.value = listActivities.value.filter(a => a.id !== activityId)
    // Cascade : On supprime aussi les liaisons aux événements
    listActivityAtEvent.value = listActivityAtEvent.value.filter(ea => ea.activityId !== activityId)
  }

  const updateActivity = (activityId: string, updatedActivity: Activity) => {
    const index = listActivities.value.findIndex(a => a.id === activityId)
    if (index !== -1) listActivities.value[index] = updatedActivity
  }

  const getActivityById = (activityId: string): Activity | undefined => {
    return listActivities.value.find(a => a.id === activityId)
  }

  // --- CRUD ACTIVITY AT EVENT ---
  const createActivityAtEvent = (activityAtEvent: EventActivity) => {
    if (activityAtEvent.id && activityAtEvent.activityId && activityAtEvent.eventType) {
      listActivityAtEvent.value.push(activityAtEvent)
    }
  }

  const deleteActivityAtEvent = (activityAtEventId: string) => {
    listActivityAtEvent.value = listActivityAtEvent.value.filter(ea => ea.id !== activityAtEventId)
  }

  const updateActivityAtEvent = (activityAtEventId: string, updatedActivityAtEvent: EventActivity) => {
    const index = listActivityAtEvent.value.findIndex(ea => ea.id === activityAtEventId)
    if (index !== -1) listActivityAtEvent.value[index] = updatedActivityAtEvent
  }

  // --- COMPUTED PROPERTIES (COMPLÈTEMENT CORRIGÉS) ---

  // 1. Liste unique et réactive des types d'événements
  const listEvent = computed<string[]>(() => {
    const categories = listActivityAtEvent.value.map(event => event.eventType)
    return [...new Set(categories)] // Supprime les doublons instantanément
  })

  // 2. Regroupement des activités par Année
  const groupActivityperYear = computed<Record<string, Activity[]>>(() => {
    return listActivityAtEvent.value.reduce((acc, event) => {
      // Trouver l'activité complète correspondante
      const activityFound = listActivities.value.find(a => a.id === event.activityId)
      
      if (activityFound) {
        // Si l'année n'existe pas encore dans l'objet, on l'initialise avec un tableau vide
        if (!acc[event.year]) {
          acc[event.year] = []
        }
        
        // CORRECTION : Évite d'ajouter des doublons d'activité la même année
        const alreadyExists = acc[event.year]?.some(a => a.id === activityFound.id)
        if (!alreadyExists) {
          acc[event.year]?.push(activityFound)
        }
      }
      return acc
    }, {} as Record<string, Activity[]>)
  })

  // 3. Regroupement des activités par Type d'Événement (ex: "Arbre de noël")
  const groupActivityperEvent = computed<Record<string, Activity[]>>(() => {
    return listEvent.value.reduce((acc, eventType) => {
      // Filtrer toutes les liaisons qui matchent ce type d'événement
      const eventsFound = listActivityAtEvent.value.filter(ea => ea.eventType === eventType)
      
      // Récupérer l'objet Activity pour chaque liaison (en éliminant les undefined cachés)
      const activities = eventsFound
        .map(ea => listActivities.value.find(a => a.id === ea.activityId))
        .filter((a): a is Activity => !!a) // Sécurité : Retire les activités introuvables

      acc[eventType] = activities
      return acc
    }, {} as Record<string, Activity[]>)
  })

  return {
    listActivities,
    listEvent,
    groupActivityperYear,
    groupActivityperEvent,
    createActivity,
    deleteActivity,
    updateActivity,
    getActivityById,
    listActivityAtEvent,
    createActivityAtEvent,
    deleteActivityAtEvent,
    updateActivityAtEvent,
  }
}