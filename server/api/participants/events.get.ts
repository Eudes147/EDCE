import { mockActivities, mockParticipantEvent, mockActivityatEvent, mockChildren } from '~/data/mockData'
import type { ParticipantEventActivity } from '~/types/participant'

// States persistants côté serveur pour la partie Événements / Activités
export const participantEventState = {
  activities: [...mockActivities],
  participantEvents: [...mockParticipantEvent] as ParticipantEventActivity[],
  eventActivities: [...mockActivityatEvent]
}

export default defineEventHandler(() => {
  return {
    listActivities: participantEventState.activities,
    listParticipantEventActivity: participantEventState.participantEvents,
    listEventActivity: participantEventState.eventActivities,
    listChildren: mockChildren // Données brutes de référence
  }
})