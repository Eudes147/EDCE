import { mockActivities, mockActivityatEvent } from '~/data/mockData'
import type { Activity, EventActivity } from '~/types/activity'

// Ces variables globales en mémoire persistent tant que le serveur tourne !
export const state = {
  activities: [...mockActivities] as Activity[],
  events: [...mockActivityatEvent] as EventActivity[]
}

export default defineEventHandler(() => {
  // Retourne la liste complète des activités
  return state.activities
})