import { state } from '../activities/index.get'
import type { Activity } from '~/types/activity'

export default defineEventHandler(() => {
  const listActivityAtEvent = state.events
  const listActivities = state.activities

  // 1. Liste unique des types d'événements
  const listEvent = [...new Set(listActivityAtEvent.map(event => event.eventType))]

  // 2. Regroupement des activités par Année
  const groupActivityperYear = listActivityAtEvent.reduce((acc, event) => {
    const activityFound = listActivities.find(a => a.id === event.activityId)
    if (activityFound) {
      if (!acc[event.year]) acc[event.year] = []
      if (!acc[event.year]?.some(a => a.id === activityFound.id)) {
        acc[event.year]?.push(activityFound)
      }
    }
    return acc
  }, {} as Record<string, Activity[]>)

  // 3. Regroupement des activités par Type d'Événement
  const groupActivityperEvent = listEvent.reduce((acc, eventType) => {
    const eventsFound = listActivityAtEvent.filter(ea => ea.eventType === eventType)
    const activities = eventsFound
      .map(ea => listActivities.find(a => a.id === ea.activityId))
      .filter((a): a is Activity => !!a)

    acc[eventType] = activities
    return acc
  }, {} as Record<string, Activity[]>)

  // On renvoie la liste brute ET les structures calculées prêtes à l'emploi
  return {
    listActivityAtEvent,
    listEvent,
    groupActivityperYear,
    groupActivityperEvent
  }
})