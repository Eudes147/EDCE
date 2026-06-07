import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
// Tes imports initiaux (inchangés)
import { mockSeance, mockParticipantSeance, mockActivityatEvent, mockParticipantEvent, mockActivities, mockChildren } from '~/data/mockData'
import type { ParticipantSeance, ParticipantEventActivity } from '~/types/participant'
import type { Month } from '~/types/index'
import type { Seance } from '~/types/seance'
import type { Child } from '~/types/child'
import type { EventType } from '~/types/activity'
import {getFullName} from '~/utils/getFullName'


export function useParticipantSeance() {
  const listSeances = ref(mockSeance)
  const listParticipantSeance = ref(mockParticipantSeance)

  // --- CRUD PARTICIPANT SEANCE ---
  const createParticipantSeance = (participantSeance: ParticipantSeance) => {
    if (participantSeance.id && participantSeance.childId && participantSeance.seanceId) {
      listParticipantSeance.value.push(participantSeance)
    }
  }

  const deleteParticipantSeance = (participantSeanceId: string) => {
    listParticipantSeance.value = listParticipantSeance.value.filter(p => p.id !== participantSeanceId)
  }

  const updateParticipantSeance = (participantSeance: ParticipantSeance) => {
    const index = listParticipantSeance.value.findIndex(p => p.id === participantSeance.id)
    if (index !== -1) listParticipantSeance.value[index] = participantSeance
  }

  const readParticipantSeance = (participantSeanceId: string) => {
    return listParticipantSeance.value.find(p => p.id === participantSeanceId)
  }

  // --- CRUD SEANCE ---
  const createSeance = (seance: Seance) => {
    if (seance.id && seance.type && seance.authorId) listSeances.value.push(seance)
  }

  const deleteSeance = (seanceId: string) => {
    listSeances.value = listSeances.value.filter(s => s.id !== seanceId)
  }

  const updateSeance = (seance: Seance) => {
    // CORRECTION : Utilisation de s.id pour trouver la bonne séance
    const index = listSeances.value.findIndex(s => s.id === seance.id)
    if (index !== -1) listSeances.value[index] = seance
  }

  const readSeance = (seanceId: string) => {
    return listSeances.value.find(s => s.id === seanceId)
  }

  // --- GETTERS ---
  const getParticipantSeanceByChildId = (childId: string) => {
    return listParticipantSeance.value.filter(p => p.childId === childId)
  }

  const getSeanceById = (seanceId: string) => {
    return listSeances.value.find(s => s.id === seanceId)
  }

  const getAuthorbySeanceId = (seanceId: string) => {
    const seance = getSeanceById(seanceId)
    return seance ? seance.authorId : null
  }

  const getSupervisorbySeanceId = (seanceId: string) => {
    const seance = getSeanceById(seanceId)
    return seance ? seance.supervisorId : null
  }

  const getSeancebyMonth = (month: Month) => {
    return listSeances.value.filter(seance => {
      const seanceMonth = new Date(seance.created_at).toLocaleString('fr-FR', { month: 'long' })
      // Sécurité : conversion en minuscule pour correspondre parfaitement à ton type Month
      return seanceMonth.toLowerCase() === month
    })
  }

  return {
    listParticipantSeance,
    getParticipantSeanceByChildId,
    getSeanceById,
    getAuthorbySeanceId,
    getSupervisorbySeanceId,
    getSeancebyMonth,
    createParticipantSeance,
    deleteParticipantSeance,
    updateParticipantSeance,
    listSeances,
    createSeance,
    deleteSeance,
    updateSeance,
    readSeance,
    readParticipantSeance,
    getFullName
  }
}

export function useParticipantEventActivity() {
  const router = useRouter()
  
  const listActivities = ref(mockActivities)
  const listParticipantEventActivity = ref(mockParticipantEvent)
  const listEventActivity = ref(mockActivityatEvent) // Ta variable réactive principale

  // CORRECTION : La fonction consomme maintenant les variables .value réactives de ce composable
  const getChildrenByActivityTitle = (year: string, eventType: EventType): Record<string, Child[]> => {
    const result: Record<string, Child[]> = {}

    // 1. Utilisation de la ref réactive listEventActivity.value
    const filteredEventActivities = listEventActivity.value.filter(
      (event) => event.year === year && event.eventType === eventType
    )

    const validEventIds = new Set(filteredEventActivities.map((e) => e.id))

    // 2. Utilisation de la ref réactive listParticipantEventActivity.value
    listParticipantEventActivity.value.forEach((part) => {
      if (validEventIds.has(part.eventActivityId)) {
        
        const eventAct = filteredEventActivities.find((e) => e.id === part.eventActivityId)
        if (!eventAct) return

        // Utilisation de la ref réactive listActivities.value
        const activity = listActivities.value.find((a) => a.id === eventAct.activityId)
        if (!activity) return

        const child = mockChildren.find((c) => c.id === part.childId)
        if (!child) return

        if (!result[activity.title]) {
          result[activity.title] = []
        }

        const alreadyAdded = result[activity.title]?.some((c) => c.id === child.id)
        if (!alreadyAdded) {
          result[activity.title]?.push(child)
        }
      }
    })

    return result
  }

  return {
    listParticipantEventActivity,
    listActivities,
    listEventActivity,
    getChildrenByActivityTitle, // Expose la fonction connectée aux REFS réactives
    getFullName
  }
}