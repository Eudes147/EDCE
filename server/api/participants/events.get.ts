import { mockParticipantEvent } from '~/data/mockData'
import type { ParticipantEventActivity } from '~/types/participant'
import {state} from '../activities/index.get'
import { Activity, EventActivity } from '~/types/activity'
import { childrenState } from '../children/index.get'
// States persistants côté serveur pour la partie Événements / Activités
export const participantEventState = {
  activities: [...state.activities] as Activity[],
  participantEvents: [...mockParticipantEvent] as ParticipantEventActivity[],
  eventActivities: [...state.events] as EventActivity[]
}

export default defineEventHandler(() => {
  return {
    listActivities: participantEventState.activities,
    listParticipantEventActivity: participantEventState.participantEvents,
    listEventActivity: participantEventState.eventActivities,
    listChildren: childrenState.children // Données brutes de référence
  }
})