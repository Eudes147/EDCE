import { seancesState } from './index.get'
import {participantSeanceState} from '../participants/seances.get'


export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  const index = seancesState.seances.findIndex(s => s.id === id)
  if (index === -1) {
    throw createError({ statusCode: 404, statusMessage: 'Seance not found' })
  }
  // Seance supprimé
  seancesState.seances.splice(index, 1)
  //Participants séance supprimé
  participantSeanceState.participants=participantSeanceState.participants.filter(participant=>participant.seanceId !== id)
  return { success: true, message: 'Seance deleted successfully' }
})