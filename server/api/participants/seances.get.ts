import { mockSeance, mockParticipantSeance, mockChildren, mockTeachers } from '~/data/mockData'
import type { ParticipantSeance } from '~/types/participant'
import type { Seance } from '~/types/seance'

export const participantSeanceState = {
  seances: [...mockSeance] as Seance[],
  participants: [...mockParticipantSeance] as ParticipantSeance[]
}

export default defineEventHandler(() => {
  return {
    listSeances: participantSeanceState.seances,
    listParticipantSeance: participantSeanceState.participants,
    listChildren: mockChildren, 
    listTeachers: mockTeachers
  }
})