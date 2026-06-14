import { mockParticipantSeance } from '~/data/mockData'
import {childrenState} from '../children/index.get'
import type { ParticipantSeance } from '~/types/participant'
import type { Seance } from '~/types/seance'
import {seancesState} from '../seances/index.get'
import { teachersState } from '../teachers/index.get'

export const participantSeanceState = {
  seances: [...seancesState.seances] as Seance[],
  participants: [...mockParticipantSeance] as ParticipantSeance[]
}

export default defineEventHandler(() => {
  return {
    listSeances: participantSeanceState.seances,
    listParticipantSeance: participantSeanceState.participants,
    listChildren: childrenState.children, 
    listTeachers: teachersState.teachers
  }
})